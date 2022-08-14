import gsap from 'gsap';
import MultiStyleText from 'pixi-multistyle-text';
import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import {ImageMarginButton} from '../buttons/ImageMarginButton';
import {AssetsManager} from '../managers/AssetsManager';
import {StorylineManager} from '../managers/StorylineManager';
import {FontStyle} from '../utils/FontStyle';
import {rgba_create, TextureHelper} from '../utils/Utils';
import {HideTimer} from './HideTimer';
import {ProgressBar} from './ProgressBar';
import {RateButton} from './RateButton';
import {Audio} from './Audio';

export class Navi extends PIXI.Container {

	private static _instance: Navi | null = null;

	private controls: PIXI.Container;

	private buttonPlay: ImageMarginButton;
	private buttonPause: ImageMarginButton;
	private buttonRate: RateButton;
	private progressBar: ProgressBar;

	private time: MultiStyleText;
	private duration: MultiStyleText;
	private time_back: PIXI.Sprite;

	private _played: boolean = false;
	private arrow!: PIXI.Point;

	public static get instance(): Navi {
		if (Navi._instance == null) Navi._instance = new Navi();
		return Navi._instance;
	}

	constructor() {
		super();


		let pointer_area: PIXI.Sprite = new PIXI.Sprite();
		pointer_area.texture = TextureHelper.createFillTexture(new PIXI.Point(Application.WIDTH, Application.HEIGHT), rgba_create(0xffffff, 0));
		this.addChild(pointer_area);

		pointer_area.interactive = true;
		pointer_area.addListener('pointermove', this.onPointerEvent);
		pointer_area.addListener('pointerdown', this.onPointerEvent);


		this.controls = new PIXI.Container();
		this.addChild(this.controls).position.set(0, 918);

		this.buttonPlay = new ImageMarginButton('btn_video_play', 0);
		this.buttonPlay.position.set(484, 0);
		this.controls.addChild(this.buttonPlay);
		this.buttonPlay.addListener('press', this.onPlayClick);

		this.buttonPause = new ImageMarginButton('btn_video_pause', 0);
		this.buttonPause.position.set(484, 0);
		this.controls.addChild(this.buttonPause);
		this.buttonPause.addListener('press', this.onPauseClick);

		this.buttonRate = new RateButton();
		this.buttonRate.position.set(598, 0);
		this.buttonRate.addListener('change', this.onRateChange);
		this.controls.addChild(this.buttonRate);

		this.progressBar = new ProgressBar();
		this.progressBar.position.set(730, 49);
		this.progressBar.addListener('seek', this.onSeek);
		this.controls.addChild(this.progressBar);

		this.time_back = AssetsManager.instance.getSprite('time_back');
		this.controls.addChild(this.time_back).position.set(1618, 16);

		this.time = new MultiStyleText('00:00', new FontStyle('Regular', 38).fill(0x225694).right().addTag('dur', new FontStyle('Regular', 38).fill(0x225694).left()).multistyle);
		this.time_back.addChild(this.time).position.set(this.time_back.width / 2 - 7, this.time_back.height / 2);
		this.time.anchor.set(1, 0.5);

		this.duration = new MultiStyleText('/00:00', new FontStyle('Regular', 38).fill(0x225694).right().addTag('dur', new FontStyle('Regular', 38).fill(0x225694).left()).multistyle);
		this.time_back.addChild(this.duration).position.set(this.time_back.width / 2 - 7, this.time_back.height / 2);
		this.duration.anchor.set(0, 0.5);

		this.played = false;
		this.visible = true;
		this.alpha = 0;
		this.audioEnabled = false;

		this.arrow = new PIXI.Point();
	}

	public onPointerEvent = (event: PIXI.InteractionEvent) => {
		switch (event.type) {
			case 'pointermove':
				this.arrow.x = event.data.global.x;
				this.arrow.y = event.data.global.y;
				this.show();
				break;

			case 'pointerdown':
				this.arrow.y = event.data.global.y;
				this.show();
				break;
		}
	}

	public show = () => {
		gsap.to(this, {duration: 0.25, alpha: 1});
		HideTimer.instance.clear();
		if (this.arrow.y > 940) return;

		HideTimer.instance.start(this.hide, 2);
	}

	public hide = () => {
		gsap.to(this, {duration: 0.25, alpha: 0});
	}

	public onPlayClick(event: PIXI.InteractionEvent) {
		Audio.instance.play();
	}

	public onPauseClick(event: PIXI.InteractionEvent) {
		Audio.instance.pause();
	}

	public onSeek(value: number) {
		Audio.instance.seek(value);
	}

	public onRateChange(value: number) {
		Audio.instance.rate(value);
	}

	public set audioEnabled(value: boolean) {
		this.controls.visible = value;
	}

	public set played(value: boolean) {
		this._played = value;
		this.buttonPlay.visible = !value;
		this.buttonPause.visible = value;
	}

	public currentProgress = (current: number, duration: number) => {
		if (isNaN(duration) == true) return;

		this.progressBar.currentProgress(current, duration);
		this.time.text = this.convertTime(current);
		this.duration.text = '/' + this.convertTime(duration);
	}

	public get played(): boolean {
		return this._played;
	}

	private convertTime = (value: number) => {
		value = Math.floor(value);
		let m: number = Math.floor(value / 60);
		let s: number = value - m * 60;

		let m_s: string = m.toString();
		if (m < 10) m_s = '0' + m_s;

		let s_s: string = s.toString();
		if (s < 10) s_s = '0' + s_s;

		return m_s + ':' + s_s;
	}

}