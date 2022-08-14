import gsap, {Linear} from 'gsap';
import * as PIXI from 'pixi.js';
import {AssetsManager} from '../managers/AssetsManager';
import {GraphicsHelper, rgba_create, TextureHelper} from '../utils/Utils';

export class ProgressBar extends PIXI.Sprite {

	private holderTrack: PIXI.Sprite;
	private bottomTrack: PIXI.Sprite;
	private currentTrack: PIXI.Sprite;
	private video_thumb: PIXI.Sprite;
	private _seekHandler: Function | null = null;

	private progress_width: number = 868;
	private progress_height: number = 12;


	private dragged: boolean = false;
	private saved_delta: number = 0;
	private saved_thumb_x: number = 0;

	constructor() {
		super();

		this.interactive = true;

		let texture: PIXI.Texture = AssetsManager.instance.getTexture('video_track');
		this.holderTrack = new PIXI.Sprite();
		this.addChild(this.holderTrack);

		this.bottomTrack = new PIXI.Sprite(texture);
		this.bottomTrack.position.set(0, 0);
		this.holderTrack.addChild(this.bottomTrack);


		this.currentTrack = AssetsManager.instance.getSprite('video_track_passed');
		this.holderTrack.addChild(this.currentTrack);
		this.currentTrack.width = 0;

		let mask: PIXI.Graphics = GraphicsHelper.createRoundedRect(this.progress_width, this.progress_height, 0x7b7677, 1, this.progress_height / 2 + 1);
		this.holderTrack.addChild(mask);


		this.holderTrack.mask = mask;

		let mouse_area: PIXI.Sprite = new PIXI.Sprite();
		mouse_area.texture = TextureHelper.createFillTexture(new PIXI.Point(this.progress_width, this.progress_height * 5), rgba_create(0xff0000, 0));
		this.addChild(mouse_area).position.set(0, -this.progress_height * 2);
		mouse_area.addListener('pointerover', this.onThumbPointerEvent);
		mouse_area.addListener('pointerout', this.onThumbPointerEvent);

		this.video_thumb = new PIXI.Sprite(AssetsManager.instance.getTexture('video_thumb'));
		this.addChild(this.video_thumb);
		this.video_thumb.position.set(0, this.progress_height / 2);
		this.video_thumb.anchor.set(0, 0.5);

		this.interactive = true;
		this.buttonMode = true;
		this.addListener('pointerdown', this.onPointerEvent);

		this.video_thumb.addListener('pointerdown', this.onThumbPointerEvent);
		this.video_thumb.addListener('pointerup', this.onThumbPointerEvent);
		this.video_thumb.addListener('pointerupoutside', this.onThumbPointerEvent);
		this.video_thumb.addListener('pointermove', this.onThumbPointerEvent);

		this.video_thumb.addListener('pointerover', this.onThumbPointerEvent);
		this.video_thumb.addListener('pointerout', this.onThumbPointerEvent);


		this.addListener('added', this.onAdded);

		this.video_thumb.interactive = true;
		this.video_thumb.buttonMode = true;
	}

	private onAdded = () => {
		this.removeListener('added', this.onAdded);
	}

	public currentProgress = (current: number, duration: number) => {
		if (this.dragged == true) return;

		if (duration == NaN && duration == Infinity && duration == 0) {
			this.visible = false;
			return;
		}
		else {
			this.visible = true;
		}

		gsap.to(this.video_thumb, {duration: 0.25, x: (this.progress_width - this.video_thumb.width) * (current / duration), ease: Linear.easeNone});
		gsap.to(this.currentTrack, {duration: 0.25, width: (this.progress_width - this.video_thumb.width) * (current / duration) + this.video_thumb.width / 2 - this.currentTrack.x, ease: Linear.easeNone});
	}

	private onPointerEvent = (event: PIXI.InteractionEvent) => {
		let local: PIXI.Point = this.toLocal(new PIXI.Point(event.data.global.x, event.data.global.y));

		let progress: number = local.x / this.progress_width;
		this.emit('seek', progress);
	}

	public set seekHandler(callback: Function) {
		this._seekHandler = callback;
	}

	private onThumbPointerEvent = (event: any) => {
		switch (event.type) {
			case 'pointerdown':
				this.dragged = true;
				this.saved_thumb_x = this.video_thumb.x;
				this.saved_delta = event.data.global.x - this.saved_thumb_x;
				break;

			case 'pointerup':
			case 'pointerupoutside':
				this.dragged = false;

				let local: PIXI.Point = this.toLocal(new PIXI.Point(event.data.global.x, event.data.global.y));
				let progress: number = local.x / this.progress_width;
				this.emit('seek', progress);

				break;

			case 'pointermove':
				if (this.dragged == false) return;
				this.video_thumb.x = event.data.global.x - this.saved_delta;
				if (this.video_thumb.x > this.progress_width - this.video_thumb.width) this.video_thumb.x = this.progress_width - this.video_thumb.width;
				if (this.video_thumb.x < 0) this.video_thumb.x = 0;
				/*
								local = this.toLocal(new PIXI.Point(event.data.global.x, event.data.global.y));
								progress = local.x / this.progress_width;
								this.emit('seek', progress);
				*/


				break;

			case 'pointerover':
				this.video_thumb.texture = AssetsManager.instance.getTexture('video_thumb_over');

				break;

			case 'pointerout':
				this.video_thumb.texture = AssetsManager.instance.getTexture('video_thumb');

				break;
		}
	}
}