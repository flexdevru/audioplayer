import * as PIXI from 'pixi.js';
export declare class Main extends PIXI.Container {
    static DEBUG: boolean;
    static instance: Main;
    private data?;
    constructor();
    private onAssetsLoadComplete;
    private createChildren;
}
