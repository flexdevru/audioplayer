import * as PIXI from 'pixi.js';
export declare class Point {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    toString(): string;
}
export declare class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x?: number, y?: number, width?: number, height?: number);
    get area(): number;
    get left(): number;
    get right(): number;
    get top(): number;
    get bottom(): number;
    get top_left(): Point;
    get top_right(): Point;
    get bottom_left(): Point;
    get bottom_right(): Point;
    toString(): string;
    hasPoint(point: Point): boolean;
    intersects(rectangle: Rectangle): boolean;
    intersection(rectangle: Rectangle): Rectangle;
}
export declare class RangeX {
    left: number;
    right: number;
    constructor(left?: number, right?: number);
    get width(): number;
    toString(): string;
    hasPoint(point: number): boolean;
}
export declare class Base64 {
    constructor();
    decode(data: string): string;
}
export declare class Trigonometry {
    static deg2rad(value: number): number;
    static rad2deg(value: number): number;
}
export declare class TransparencyHitArea implements PIXI.IHitArea {
    private pixelData;
    private width;
    private height;
    constructor(source: PIXI.Sprite);
    getPixel: (x: number, y: number) => number;
    contains: (x: number, y: number) => boolean;
}
export declare class DottedLine extends PIXI.Sprite {
    private direction;
    private distance;
    constructor(distance: number, direction: string, color: number, weight: number, strong?: number);
}
export declare class TextureHelper {
    static createGradientCanvas: (size: PIXI.Point, colors: Array<string>, points: Array<PIXI.Point>, shadow?: Shadow) => HTMLCanvasElement;
    static createRoundedGradientCanvas: (size: PIXI.Point, colors: Array<string>, points: Array<PIXI.Point>, radius?: number, shadow?: Shadow) => HTMLCanvasElement;
    static createRoundedCanvas: (width: number, height: number, fill: string, strokeColor: string, strokeWidth: number, radius: number, offset?: number) => HTMLCanvasElement;
    static createRoundedTexture_old: (width: number, height: number, fill: string, strokeColor: string, strokeWidth: number, radius: number, offset?: number) => Promise<PIXI.Texture>;
    static createRoundedTexture: (width: number, height: number, fill: string, strokeColor: string, strokeWidth: number, radius: number, offset?: number) => PIXI.Texture;
    static createFillCanvas: (size: PIXI.Point, color: string, shadow?: Shadow) => HTMLCanvasElement;
    static createFillCanvasEx: (size: PIXI.Point, color: string, shadow?: Shadow) => HTMLCanvasElement;
    static createGradientTexture: (size: PIXI.Point, colors: Array<string>, points: Array<PIXI.Point>, shadow?: Shadow) => PIXI.Texture;
    static createFillTexture: (size: PIXI.Point, color: string, shadow?: Shadow) => PIXI.Texture;
    static createFillTextureEx: (size: PIXI.Point, color: string, shadow?: Shadow) => PIXI.Texture;
}
export declare class GraphicsHelper {
    static createLine: (width: number, height: number, color: number, alpha?: number) => PIXI.Graphics;
    static createFill: (fillColor?: number, fillAlpha?: number) => PIXI.Graphics;
    static createRect: (width: number, height: number, fillColor?: number, fillAlpha?: number, borderWidth?: number, borderColor?: number, borderAlpha?: number) => PIXI.Graphics;
    static createDottedRect: (width: number, height: number, fillColor: number, fillAlpha: number, borderWidth: number, borderColor: number, borderAlpha: number, borderGap?: number) => PIXI.Graphics;
    static createMask: (width: number, height: number, radius?: number) => PIXI.Graphics;
    static createRoundedRect: (width: number, height: number, fillColor?: number, fillAlpha?: number, radius?: number, border?: Object) => PIXI.Graphics;
    static createCircle: (width: number, fillColor?: number, fillAlpha?: number, border?: Object) => PIXI.Graphics;
    static createPoligon: (points: Array<PIXI.Point>, fillColor?: number, fillAlpha?: number, border?: Object) => PIXI.Graphics;
}
export declare class Shadow extends Object {
    shadowColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    constructor();
}
export declare class SaveImage {
    private fileName;
    constructor();
    save: (path: string, fileName: string) => void;
    saveCanvas: (canvas: HTMLCanvasElement, fileName: string) => void;
    private onImageLoad;
    private saveData;
}
export declare var rgba_create: (color: number, alpha?: number) => string;
export declare function parse_point(value: string): PIXI.Point;
export declare function parse_rect(value: string): Rectangle;
export declare class ArrayEx<T> extends Array {
    constructor(data: Array<T>);
    randomize: (count?: number) => void;
    private _randomize;
}
export declare class TableIteratior {
    private x;
    private y;
    private dx;
    private dy;
    private cols;
    private x_init;
    private y_init;
    private index;
    private last_delta;
    private odd_row;
    private row;
    private even_index;
    constructor(x: number, y: number, dx: number, dy: number, cols: number, odd_row?: number);
    next: () => PIXI.Point;
    get even(): boolean;
}
export declare function b64DecodeUnicode(str: string): string;
