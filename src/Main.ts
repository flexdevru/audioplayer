import * as PIXI from 'pixi.js';
import {AssetsManager} from './managers/AssetsManager';
import {Video} from './video/Video';


export class Main extends PIXI.Container {

	public static DEBUG: boolean = true;
	public static instance: Main;

	constructor() {

		super();
		this.addChild(AssetsManager.instance).start(this.onAssetsLoadComplete);
	}

	private onAssetsLoadComplete = () => {

		Main.instance = this;
		this.removeChild(AssetsManager.instance);
		this.createChildren();
	}

	private createChildren = () => {

		this.addChild(Video.instance);
		Video.instance.show('video.mp4');
	}
}