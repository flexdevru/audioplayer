export declare class StorylineManager {
    private static _instance;
    private storyLine;
    private player;
    static get instance(): StorylineManager;
    constructor();
    get inPlayer(): boolean;
    goNext: () => void;
    goNextSlide: () => void;
    setVar: (variable: string, value: string | number) => void;
    getVar: (variable: string) => string | number;
    getTaskVar: (variable: string) => string;
    get showHelpValue(): number;
    get completedValue(): number;
    get storeValue(): string;
    set showHelpValue(value: number);
    set completedValue(value: number);
    set storeValue(value: string);
    invoke_hideplayer(): void;
    invoke_showplayer(): void;
    invoke_jumptonextslide(): void;
}
