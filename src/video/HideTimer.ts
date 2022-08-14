import * as PIXI from 'pixi.js';

export class HideTimer extends PIXI.Container {

    private static _instance: HideTimer;
    private callback!: Function;
    private delay: number = 0;
    private timer: number = 0;
    private paused: boolean = false;

    public static get instance(): HideTimer {
        if (HideTimer._instance == null) HideTimer._instance = new HideTimer();
        return HideTimer._instance;
    }

    constructor() {
        super();
    }

    public start = (callback: Function, delay: number) => {
        if (this.paused == true) return;

        clearTimeout(this.timer);
        this.callback = callback;
        this.delay = delay;

        this.timer = setTimeout(this.callback, this.delay * 1000);
    }

    public clear = () => {
        clearTimeout(this.timer);
    }

    public pause = () => {
        clearTimeout(this.timer);
        this.paused = true;
    }

    public resume = () => {
        this.paused = false;
        this.timer = setTimeout(this.callback, this.delay * 1000);
    }
}