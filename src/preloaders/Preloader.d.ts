import * as PIXI from 'pixi.js';
export declare class Preloader extends PIXI.Sprite {
    private counter;
    constructor();
    init: () => void;
    progress: (value: number) => void;
}
