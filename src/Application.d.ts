import * as PIXI from 'pixi.js';
export declare class Application {
    private static _instance;
    static WIDTH: number;
    static HEIGHT: number;
    private application;
    private main;
    static get instance(): Application;
    constructor();
    get renderer(): PIXI.AbstractRenderer;
    get stage(): PIXI.Container;
    init: () => void;
    start: () => void;
}
