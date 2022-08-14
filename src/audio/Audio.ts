import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import {AssetsManager} from '../managers/AssetsManager';
import {StorylineManager} from '../managers/StorylineManager';
import {VideoPreloader} from '../preloaders/VideoPreloader';
import {rgba_create, TextureHelper} from '../utils/Utils';
import {Navi} from './Navi';

export class Audio extends PIXI.Sprite {

    private static _instance: Audio;

    private content: PIXI.Sprite;

    private audio!: HTMLAudioElement | null;

    private preloader: VideoPreloader;

    private video_width: number;
    private video_height: number;

    private ended: boolean = false;

    private first: boolean = true;

    private playbackRate: number = 1;


    public static get instance(): Audio {
        if (Audio._instance == null) Audio._instance = new Audio();
        return Audio._instance;
    }

    constructor() {
        super();

        this.video_width = Application.WIDTH;
        this.video_height = Application.HEIGHT;

        this.texture = TextureHelper.createFillTexture(new PIXI.Point(Application.WIDTH, Application.HEIGHT), rgba_create(0xffffff));


        this.content = new PIXI.Sprite();
        this.content.texture = PIXI.Texture.EMPTY;
        this.addChild(this.content);



        this.visible = false;
        this.alpha = 0;


        this.content.visible = false;


        this.preloader = new VideoPreloader(this.video_width, this.video_height);
        this.addChild(this.preloader);

        this.addChild(Navi.instance);
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
            this.content.visible = false;
            this.audio.currentTime = value * this.audio.duration;
        }
    }

    public rate = (value: number) => {
        if (this.audio != null) {
            this.audio.playbackRate = value;
            this.playbackRate = value;
        }
    }

    private onVideoEvent = (event: Event) => {
        switch (event.type) {

            case 'canplaythrough':

                if (this.first == false) return;
                this.first = false;

                this.preloader.stop();

                this.content.width = this.video_width;
                this.content.height = this.video_height;
                this.content.visible = true;

                if (this.ended == true) return;
                if (this.audio != null) this.audio.play();

                Navi.instance.show();
                console.log(event);
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
                this.content.visible = true;
                break;
        }
    }

    public show = (file_name: string) => {
        this.ended = false;

        Navi.instance.audioEnabled = true;

        if (this.audio != null) {
            this.audio.removeEventListener('canplaythrough', this.onVideoEvent, false);
            this.audio.removeEventListener('timeupdate', this.onVideoEvent, false);
            this.audio.removeEventListener('ended', this.onVideoEvent, false);
            this.audio = null;
        }

        this.preloader.start();
        this.content.visible = false;

        this.audio = document.createElement('audio') as HTMLAudioElement;
        this.audio.src = AssetsManager.SOUNDS + file_name;
        this.audio.loop = false;
        this.audio.addEventListener('canplaythrough', this.onVideoEvent, false);
        this.audio.addEventListener('timeupdate', this.onVideoEvent, false);
        this.audio.addEventListener('ended', this.onVideoEvent, false);
        this.audio.addEventListener('play', this.onVideoEvent, false);
        this.audio.addEventListener('pause', this.onVideoEvent, false);

        this.audio.addEventListener('seeking', this.onVideoEvent, false);
        this.audio.addEventListener('seeked', this.onVideoEvent, false);

        this.visible = true;
        this.alpha = 1;
    }


    public stop = () => {
        if (this.audio != null) this.audio.pause();
    }

    private complete = () => {

        Navi.instance.played = false;

        if (this.audio != null) this.audio.pause();
        new StorylineManager().goNext();
    }
}

