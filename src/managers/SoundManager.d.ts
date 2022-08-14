export declare class SoundManager {
    private static _instance;
    static get instance(): SoundManager;
    constructor();
    init: () => void;
    play: (type: string) => void;
    stop: (type: string) => void;
}
