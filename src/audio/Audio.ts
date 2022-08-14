import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import {AssetsManager} from '../managers/AssetsManager';
import {StorylineManager} from '../managers/StorylineManager';
import {VideoPreloader} from '../preloaders/VideoPreloader';
import {rgba_create, TextureHelper} from '../utils/Utils';
import {Navi} from './Navi';

export class Audio extends PIXI.Sprite {

    private static _instance: Audio;
    private audio!: HTMLAudioElement | null;
    private ended: boolean = false;
    private first: boolean = true;
    private playbackRate: number = 1;

    private audioContext: AudioContext;
    private analyser: AnalyserNode;
    public spectrumArray: Uint8Array;
    public volumeArray: Float32Array;

    public static get instance(): Audio {
        if (Audio._instance == null) Audio._instance = new Audio();
        return Audio._instance;
    }

    constructor() {
        super();

        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = 2048;
        this.spectrumArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.volumeArray = new Float32Array(this.analyser.frequencyBinCount);
    }

    public play = () => {
        if (this.audio != null) {
            this.audio.play();
            this.audio.playbackRate = this.audio.playbackRate;
        }
    }

    public pause = () => {
        if (this.audio != null) this.audio.pause();
    }

    public seek = (value: number) => {
        if (this.audio != null) {
            this.audio.currentTime = value * this.audio.duration;
        }
    }

    public rate = (value: number) => {
        if (this.audio != null) {
            this.audio.playbackRate = value;
            this.playbackRate = value;
        }
    }

    private onAudioEvent = (event: Event) => {
        switch (event.type) {

            case 'canplaythrough':

                if (this.first == false) return;
                this.first = false;

                if (this.ended == true) return;
                if (this.audio != null) this.audio.play();

                let source = this.audioContext.createMediaElementSource(this.audio as HTMLMediaElement);
                source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);

                Navi.instance.show();
                break;

            case 'play':
                Navi.instance.played = true;
                if (this.audio != null) this.audio.playbackRate = this.playbackRate;
                break;

            case 'pause':
                Navi.instance.played = false;
                break;

            case 'ended':

                this.ended = true;
                this.complete();

            case 'timeupdate':
                if (this.audio != null) Navi.instance.currentProgress(this.audio.currentTime, this.audio.duration);

                break;

            case 'seeking':

                break;


            case 'seeked':
                break;
        }
    }

    public show = (file_name: string) => {
        this.ended = false;

        Navi.instance.audioEnabled = true;

        if (this.audio != null) {
            this.audio.removeEventListener('canplaythrough', this.onAudioEvent, false);
            this.audio.removeEventListener('timeupdate', this.onAudioEvent, false);
            this.audio.removeEventListener('ended', this.onAudioEvent, false);
            this.audio = null;
        }

        this.audio = document.createElement('audio') as HTMLAudioElement;
        this.audio.src = AssetsManager.SOUNDS + file_name;
        this.audio.loop = false;
        this.audio.addEventListener('canplaythrough', this.onAudioEvent, false);
        this.audio.addEventListener('timeupdate', this.onAudioEvent, false);
        this.audio.addEventListener('ended', this.onAudioEvent, false);
        this.audio.addEventListener('play', this.onAudioEvent, false);
        this.audio.addEventListener('pause', this.onAudioEvent, false);

        this.audio.addEventListener('seeking', this.onAudioEvent, false);
        this.audio.addEventListener('seeked', this.onAudioEvent, false);
    }

    public stop = () => {
        if (this.audio != null) this.audio.pause();
    }

    private complete = () => {

        Navi.instance.played = false;

        if (this.audio != null) this.audio.pause();
        new StorylineManager().goNext();
    }

    public tick = () => {
        this.analyser.getByteTimeDomainData(this.spectrumArray);
        this.analyser.getFloatFrequencyData(this.volumeArray);
        this.emit('spectrum', this.spectrumArray);
        this.emit('volume', this.volumeArray);
    }
}

