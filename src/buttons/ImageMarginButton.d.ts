import * as PIXI from 'pixi.js';
export declare class ImageMarginButton extends PIXI.Sprite {
    private type;
    constructor(type: string, margin?: number | Array<number>);
    set enabled(value: boolean);
    private onPointerEvent;
}
