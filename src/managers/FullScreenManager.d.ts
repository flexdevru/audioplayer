export declare class FullScreenManager {
    private static _instance;
    static currentScale: number;
    private elements;
    private backgroundColor;
    static get instance(): FullScreenManager;
    constructor();
    init(elements: Array<HTMLElement>, backgroundColor?: string): void;
    centerFit(): void;
    center(): void;
    scale(): void;
}
