import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import {AssetsManager} from '../managers/AssetsManager';
import {StorylineManager} from '../managers/StorylineManager';
import {VideoPreloader} from '../preloaders/VideoPreloader';
import {rgba_create, TextureHelper} from '../utils/Utils';
import {Navi} from './Navi';

export class Video extends PIXI.Sprite {

    private static _instance: Video;

    private seeking_content: PIXI.Sprite;
    private content: PIXI.Sprite;

    private video!: HTMLVideoElement | null;
    private videoResource!: PIXI.VideoResource;

    private preloader: VideoPreloader;

    private video_width: number;
    private video_height: number;

    private ended: boolean = false;

    private first: boolean = true;

    private playbackRate: number = 1;

    public static get instance(): Video {
        if (Video._instance == null) Video._instance = new Video();
        return Video._instance;
    }

    constructor() {
        super();

        this.video_width = Application.WIDTH;
        this.video_height = Application.HEIGHT;

        this.texture = TextureHelper.createFillTexture(new PIXI.Point(Application.WIDTH, Application.HEIGHT), rgba_create(0xffffff));

        this.seeking_content = new PIXI.Sprite();
        this.addChild(this.seeking_content);


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
        if (this.video != null) {
            this.video.play();
            this.video.playbackRate = this.video.playbackRate;
        }
    }

    public pause = () => {
        if (this.video != null) this.video.pause();
    }

    public seek = (value: number) => {
        if (this.video != null) {
            this.seeking_content.texture = this.content.texture.clone();
            this.content.visible = false;
            this.video.currentTime = value * this.video.duration;
        }
    }

    public rate = (value: number) => {
        if (this.video != null) {
            this.video.playbackRate = value;
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

                this.seeking_content.width = this.video_width;
                this.seeking_content.height = this.video_height;

                if (this.ended == true) return;
                if (this.video != null) this.video.play();

                Navi.instance.show();
                console.log(event);
                break;

            case 'play':
                Navi.instance.played = true;
                if (this.video != null) this.video.playbackRate = this.playbackRate;
                break;

            case 'pause':
                Navi.instance.played = false;
                break;

            case 'ended':

                this.ended = true;
                this.complete();

            case 'timeupdate':
                if (this.video != null) Navi.instance.currentProgress(this.video.currentTime, this.video.duration);

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

        Navi.instance.videoEnabled = true;
        /*
        Navi.instance.playHandler = this.onPlayClick;
                Navi.instance.pauseHandler = this.onPauseClick;
                Navi.instance.seekHandler = this.seek;
                Navi.instance.rateHandler = this.rate;
                Navi.instance.menuHandler = this.menu;
        */
        if (this.video != null) {
            this.video.removeEventListener('canplaythrough', this.onVideoEvent, false);
            this.video.removeEventListener('timeupdate', this.onVideoEvent, false);
            this.video.removeEventListener('ended', this.onVideoEvent, false);
            this.video = null;
        }

        this.preloader.start();
        this.content.visible = false;
        this.videoResource = new PIXI.VideoResource(AssetsManager.VIDEOS + file_name, {autoLoad: true, autoPlay: false, });
        this.video = this.videoResource.source;
        this.video.loop = false;
        this.video.addEventListener('canplaythrough', this.onVideoEvent, false);
        this.video.addEventListener('timeupdate', this.onVideoEvent, false);
        this.video.addEventListener('ended', this.onVideoEvent, false);
        this.video.addEventListener('play', this.onVideoEvent, false);
        this.video.addEventListener('pause', this.onVideoEvent, false);

        this.video.addEventListener('seeking', this.onVideoEvent, false);
        this.video.addEventListener('seeked', this.onVideoEvent, false);

        this.content.texture = PIXI.Texture.from(this.videoResource.source);

        this.visible = true;
        this.alpha = 1;
    }


    public stop = () => {
        if (this.video != null) this.video.pause();
    }

    private complete = () => {

        Navi.instance.played = false;

        if (this.video != null) this.video.pause();
        new StorylineManager().goNext();
    }
}

