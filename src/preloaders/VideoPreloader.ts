import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { Application } from '../Application';
import * as Utils from "../utils/Utils";

export class VideoPreloader extends PIXI.Sprite {
	private timer: number = 0;
	private counter: number = 0;

	private preloader_width: number;
	private preloader_height: number;

	constructor(width: number = Application.WIDTH, height: number = Application.HEIGHT) {
		super();
		this.preloader_width = width;
		this.preloader_height = height;

		this.addChild(Utils.GraphicsHelper.createRect(this.preloader_width, this.preloader_height, 0x000000, 0.25));
	}

	public init = () => {

	}

	public start = () => {
		this.visible = true;
		this.progress();
	}

	public stop = () => {
		this.visible = false;
		clearTimeout(this.timer);
	}

	private progress = () => {
		this.counter += 5;
		let radius: number = 50;
		let x: number = radius * Math.sin(Math.PI * this.counter / 180) + this.preloader_width / 2;
		let y: number = -radius * Math.cos(Math.PI * this.counter / 180) + this.preloader_height / 2;

		let item: VideoPreloaderItem = new VideoPreloaderItem();
		this.addChild(item).position.set(x, y);
		item.show();

		this.timer = setTimeout(this.progress, 15);
	}
}

class VideoPreloaderItem extends PIXI.Sprite {
	constructor() {
		super();

		let circle: PIXI.Graphics = new PIXI.Graphics();
		circle.beginFill(0xffffff);
		circle.drawCircle(0, 0, 9);
		circle.endFill();

		this.addChild(circle);

		this.alpha = 0;
	}

	public show = () => {
		this.alpha = 1;
		gsap.to(this, { duration:0.5, alpha: 0, onComplete: this.onComplete });
		gsap.to(this.scale, { duration: 0.5, x: 0.5 });
		gsap.to(this.scale, { duration: 0.5, y: 0.5 });
	}

	private onComplete = () => {
		if (this.parent != null) this.parent.removeChild(this);
	}
}