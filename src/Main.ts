import * as PIXI from 'pixi.js';
import {AssetsManager} from './managers/AssetsManager';
import {Audio} from './audio/Audio';


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

		this.addChild(Audio.instance).show('audio.mp3');
	}
}