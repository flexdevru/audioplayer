import * as PIXI from 'pixi.js';
import {Main} from './Main';
import {FullScreenManager} from './managers/FullScreenManager';
import {StorylineManager} from './managers/StorylineManager';
import {FontsManager} from './managers/FontsManager';
import {CompilationParams} from './utils/CompilationParams';

export class Application {
	private static _instance: Application;

	static WIDTH: number = 1920;
	static HEIGHT: number = 1080;

	private application: PIXI.Application;

	private main!: Main;

	public static get instance(): Application {

		if (Application._instance == null) Application._instance = new Application();
		return Application._instance;
	}

	constructor() {

		this.application = new PIXI.Application({width: Application.WIDTH, height: Application.HEIGHT, antialias: true, backgroundColor: 0xffffff, resolution: 1});
		this.renderer.view.style.display = 'none';

		if (!StorylineManager.instance.inPlayer) this.renderer.view.style.border = 'solid 1px #d2d2d2';
		document.body.appendChild(this.application.view);
		document.documentElement.style.overflow = 'hidden';

		FullScreenManager.instance.init([this.application.view], '#ffffff');

		console.info('Build time:', CompilationParams.COMPILATION_DATE);
		console.info('mailto:admin@flex-dev.ru');
		console.info('https://t.me/flexdev');
	}

	public get renderer(): PIXI.AbstractRenderer {

		return this.application.renderer;
	}

	public get stage(): PIXI.Container {

		return this.application.stage;
	}

	public init = () => {
		this.main = new Main();
		this.application.stage.addChild(this.main);
		this.renderer.view.style.display = '';

		this.application.ticker.add(() => {
			this.renderer.render(this.application.stage);
			StorylineManager.instance.inPlayer ? FullScreenManager.instance.scale() : FullScreenManager.instance.centerFit();
		});
	}

	public start = () => {
		FontsManager.instance.init(Application.instance.init);
	}
}

Application.instance.start();