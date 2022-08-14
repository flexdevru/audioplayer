export class StorylineManager {
	private static _instance: StorylineManager;
	private storyLine: any = window.parent;
	private player: any;

	public static get instance(): StorylineManager {
		if (StorylineManager._instance == null) StorylineManager._instance = new StorylineManager();
		return StorylineManager._instance;
	}

	constructor() {
		if (this.storyLine != null) {
			try {
				this.player = this.storyLine.GetPlayer();
			}
			catch (e) {
				this.player = null;
			}
		}
	}

	public get inPlayer(): boolean {
		return this.player == null ? false : true;
	}

	public goNext = () => {
		let currentTime = new Date();
		let uniqueTime = currentTime.getTime();
		if (this.player != null) this.player.SetVar('goNext', uniqueTime);
		console.log('goNext invoked');
	}

	public goNextSlide = () => {
		let currentTime = new Date();
		let uniqueTime = currentTime.getTime();
		if (this.player != null) this.player.SetVar('goNextSlide', uniqueTime);
		console.log('goNextSlide invoked');
	}

	public setVar = (variable: string, value: string | number) => {

		let currentTime = new Date();
		if (value == null) value = currentTime.getTime();

		if (this.player != null) this.player.SetVar(variable, value);
		console.log(variable, 'set to value:', value);
	}

	public getVar = (variable: string): string | number => {

		let value: any = null;
		if (this.player != null) value = this.player.GetVar(variable);
		console.log(variable, 'get value:', value);
		return value;
	}

	public getTaskVar = (variable: string): string => {

		return window[variable];
	}

	public get showHelpValue(): number {

		return this.getVar(this.getTaskVar('showhelp_var')) as number;
	}

	public get completedValue(): number {

		return this.getVar(this.getTaskVar('completed_var')) as number;
	}

	public get storeValue(): string {

		return this.getVar(this.getTaskVar('store_var')) as string;
	}

	public set showHelpValue(value: number) {

		this.setVar(this.getTaskVar('showhelp_var'), value);
	}

	public set completedValue(value: number) {

		this.setVar(this.getTaskVar('completed_var'), value);
	}

	public set storeValue(value: string) {

		this.setVar(this.getTaskVar('store_var'), value);
	}

	public invoke_hideplayer() {

		let value: number = new Date().getTime();
		if (this.player != null) this.player.SetVar('invoke_hideplayer', value);
		console.log('invoke_hideplayer changed');
	}

	public invoke_showplayer() {

		let value: number = new Date().getTime();
		if (this.player != null) this.player.SetVar('invoke_showplayer', value);
		console.log('invoke_showplayer changed');
	}

	public invoke_jumptonextslide() {

		let value: number = new Date().getTime();
		if (this.player != null) this.player.SetVar('invoke_jumptonextslide', value);
		console.log('invoke_jumptonextslide changed');
	}

	public invoke_jumptopreviousslide() {

		let value: number = new Date().getTime();
		if (this.player != null) this.player.SetVar('invoke_jumptopreviousslide', value);
		console.log('invoke_jumptopreviousslide changed');
	}

	public invoke_showtoc() {

		let value: number = new Date().getTime();
		if (this.player != null) this.player.SetVar('invoke_showtoc', value);
		console.log('invoke_showtoc changed');
	}
}