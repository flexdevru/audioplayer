import { TextStyleSet } from 'pixi-multistyle-text';
export declare class FontStyle {
    private _style;
    constructor(fontFamily: string, fontSize?: number);
    get multistyle(): TextStyleSet;
    get style(): Object;
    setStyles: (values: Object) => FontStyle;
    fontSize: (value: number) => FontStyle;
    fill: (value: number) => FontStyle;
    white: () => FontStyle;
    black: () => FontStyle;
    wordWrap: (value?: number) => FontStyle;
    align: (value: string) => FontStyle;
    left: () => FontStyle;
    right: () => FontStyle;
    center: () => FontStyle;
    lineHeight: (value: number) => FontStyle;
    private iterationCopy;
    private isObject;
    addTag: (name: string, style: FontStyle) => FontStyle;
}
