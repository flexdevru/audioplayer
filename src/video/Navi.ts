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
import {Video} from './Video';

export class Navi extends PIXI.Container {

	private static _instance: Navi | null = null;

	private video_controls: PIXI.Container;

	private buttonPlay: ImageMarginButton;
	private buttonPause: ImageMarginButton;

	private buttonNext: ImageMarginButton;
	private buttonPrev: ImageMarginButton;
	private buttonMenu: ImageMarginButton;

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


		this.video_controls = new PIXI.Container();
		this.addChild(this.video_controls).position.set(0, 918);

		this.buttonPrev = new ImageMarginButton('btn_prev', 0);
		this.buttonPrev.position.set(84, 0);
		this.video_controls.addChild(this.buttonPrev);
		this.buttonPrev.addListener('pointerdown', this.onPrevClick);

		this.buttonNext = new ImageMarginButton('btn_next', 0);
		this.buttonNext.position.set(352, 0);
		this.video_controls.addChild(this.buttonNext);
		this.buttonNext.addListener('pointerdown', this.onNextClick);

		this.buttonPlay = new ImageMarginButton('btn_video_play', 0);
		this.buttonPlay.position.set(484, 0);
		this.video_controls.addChild(this.buttonPlay);
		this.buttonPlay.addListener('press', this.onPlayClick);

		this.buttonPause = new ImageMarginButton('btn_video_pause', 0);
		this.buttonPause.position.set(484, 0);
		this.video_controls.addChild(this.buttonPause);
		this.buttonPause.addListener('press', this.onPauseClick);

		this.buttonMenu = new ImageMarginButton('btn_menu', 0);
		this.buttonMenu.position.set(1774, 44 - 918);
		this.video_controls.addChild(this.buttonMenu);
		this.buttonMenu.addListener('press', this.onMenuClick);

		this.buttonRate = new RateButton();
		this.buttonRate.position.set(598, 0);
		this.buttonRate.addListener('change', this.onRateChange);
		this.video_controls.addChild(this.buttonRate);

		let slide_counter: PIXI.Sprite = AssetsManager.instance.getSprite('slide_counter');
		this.video_controls.addChild(slide_counter).position.set(198, 18);

		let counter: MultiStyleText = new MultiStyleText('20/56', {default: {fontFamily: 'Regular', fontSize: 38, fill: 0x225694, align: 'center'}, b: {fontFamily: 'Bold', fontSize: 38, fill: 0x225694, align: 'center'}});
		slide_counter.addChild(counter).position.set(slide_counter.width / 2, slide_counter.height / 2);
		counter.anchor.set(0.5, 0.5);

		let value: string = new StorylineManager().getVar('slidecounter') as string;

		if (value == null) counter.text = '<b>00</b>/00';
		else {
			let tmp: Array<string> = value.split('/');
			counter.text = '<b>' + tmp[0] + '</b>/' + tmp[1];
		}

		this.progressBar = new ProgressBar();
		this.progressBar.position.set(730, 49);
		this.progressBar.addListener('seek', this.onSeek);
		this.video_controls.addChild(this.progressBar);


		this.time_back = AssetsManager.instance.getSprite('time_back');
		this.video_controls.addChild(this.time_back).position.set(1618, 16);

		this.time = new MultiStyleText('00:00', new FontStyle('Regular', 38).fill(0x225694).right().addTag('dur', new FontStyle('Regular', 38).fill(0x225694).left()).multistyle);
		this.time_back.addChild(this.time).position.set(this.time_back.width / 2 - 7, this.time_back.height / 2);
		this.time.anchor.set(1, 0.5);

		this.duration = new MultiStyleText('/00:00', new FontStyle('Regular', 38).fill(0x225694).right().addTag('dur', new FontStyle('Regular', 38).fill(0x225694).left()).multistyle);
		this.time_back.addChild(this.duration).position.set(this.time_back.width / 2 - 7, this.time_back.height / 2);
		this.duration.anchor.set(0, 0.5);


		this.played = false;
		this.visible = true;
		this.alpha = 0;
		this.videoEnabled = false;

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

	public onPrevClick = (event: PIXI.InteractionEvent) => {

		new StorylineManager().invoke_jumptopreviousslide();
	}

	public onNextClick = (event: PIXI.InteractionEvent) => {

		new StorylineManager().invoke_jumptonextslide();
	}

	public onMenuClick(event: PIXI.InteractionEvent) {
		Video.instance.pause();
		new StorylineManager().invoke_showtoc();
	}


	public onPlayClick(event: PIXI.InteractionEvent) {
		Video.instance.play();
	}

	public onPauseClick(event: PIXI.InteractionEvent) {
		Video.instance.pause();
	}

	public onSeek(value: number) {
		Video.instance.seek(value);
	}

	public onRateChange(value: number) {
		Video.instance.rate(value);
	}

	public set videoEnabled(value: boolean) {
		this.video_controls.visible = value;
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