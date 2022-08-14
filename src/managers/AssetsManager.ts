import * as PIXI from 'pixi.js';
import * as JSON5 from 'json5';
import {Data} from '../utils/Data';
import {b64DecodeUnicode} from "../utils/Utils";
import {Preloader} from '../preloaders/Preloader';

export class AssetsManager extends PIXI.Container {
	private callback: any;

	private static _instance: AssetsManager;

	public static DATA: string = 'data/';
	public static IMAGES: string = 'data/images/';
	public static SOUNDS: string = 'data/sounds/';
	public static VIDEOS: string = 'data/videos/';
	public static FILES: string = 'data/files/';

	private loader: PIXI.Loader;

	private keys: Object;


	private maxItems: number = 0;

	private preloader: Preloader;

	public static get instance(): AssetsManager {
		if (AssetsManager._instance == null) AssetsManager._instance = new AssetsManager();
		return AssetsManager._instance;
	}

	constructor() {
		super();

		this.loader = new PIXI.Loader();

		this.keys = new Object();

		this.preloader = new Preloader();
		this.addChild(this.preloader);
		this.preloader.addListener('ready', this.onPreloaderReady);
	}

	public start = (callback: any) => {
		this.callback = callback;
		this.preloader.init();
	}

	private onPreloaderReady = () => {

		let images: Object = this.getObject('images');

		for (let key in images) {
			let image: string = images[key];
			let dotIndex: number = image.lastIndexOf('.');
			let ext: string = image.substring(dotIndex + 1);
			if (ext != 'svg') this.loader.add(key, AssetsManager.IMAGES + image);
			this.keys[key] = ext;
			this.keys[key + '_url'] = AssetsManager.IMAGES + image;
		}
		this.loader.onProgress.add(this.onProgressLoad);
		this.loader.load(this.callback);
	}

	private onProgressLoad = (loader: PIXI.Loader, resource: PIXI.LoaderResource) => {
		this.preloader.progress(loader.progress);
	}

	public getResource = (name: string): PIXI.LoaderResource => {
		return this.loader.resources[name];
	}

	public getObject = (name: string): Object => {
		let res: string = Data[name];
		res = b64DecodeUnicode(res);
		return JSON5.parse(res);
	}

	public getTexture = (name: string): PIXI.Texture => {
		/*
		if (this.keys[name] == 'svg') {
			let texture: PIXI.Texture = PIXI.Texture.fromImage(this.keys[name + '_url']);
			return texture;
		}
		*/
		return this.loader.resources[name].texture?.clone() as PIXI.Texture;;
		//return this.loader.resources[name].texture;
	}

	public getSprite = (name: string): PIXI.Sprite => {
		return new PIXI.Sprite(this.getTexture(name));
	}

	public stopPreloader = () => {

	}
}