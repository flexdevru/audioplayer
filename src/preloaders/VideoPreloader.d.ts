import * as PIXI from 'pixi.js';
export declare class VideoPreloader extends PIXI.Sprite {
    private timer;
    private counter;
    private preloader_width;
    private preloader_height;
    constructor(width?: number, height?: number);
    init: () => void;
    start: () => void;
    stop: () => void;
    private progress;
}
