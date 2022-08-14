import * as PIXI from 'pixi.js';
import {AssetsManager} from './managers/AssetsManager';
import {Audio} from './audio/Audio';
import {Navi} from './audio/Navi';
import {Spectrum} from './spectrum/Spectrum';
import {Volumes} from './spectrum/Volumes';
import {RoundSpectrum} from './spectrum/RoundSpectrum';

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
		this.addChild(new Spectrum()).position.set(100, 50);
		this.addChild(new RoundSpectrum()).position.set(1200, 50);
		this.addChild(new Volumes()).position.set(100, 400);
		this.addChild(Navi.instance);
	}
}