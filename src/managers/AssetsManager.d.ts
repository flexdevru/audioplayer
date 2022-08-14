import * as PIXI from 'pixi.js';
export declare class AssetsManager extends PIXI.Container {
    private callback;
    private static _instance;
    static DATA: string;
    static IMAGES: string;
    static SOUNDS: string;
    static VIDEOS: string;
    static FILES: string;
    private loader;
    private keys;
    private maxItems;
    private preloader;
    static get instance(): AssetsManager;
    constructor();
    start: (callback: any) => void;
    private onPreloaderReady;
    private onProgressLoad;
    getResource: (name: string) => PIXI.LoaderResource;
    getObject: (name: string) => Object;
    getTexture: (name: string) => PIXI.Texture;
    getSprite: (name: string) => PIXI.Sprite;
    stopPreloader: () => void;
}
