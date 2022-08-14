import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {AssetsManager} from '../managers/AssetsManager';
import {rgba_create, TextureHelper} from '../utils/Utils';
import {HideTimer} from './HideTimer';

export class RateButton extends PIXI.Container {
    private state: string;
    private btn: PIXI.Sprite;
    private panel: RatePanel;
    public lbl_rate: PIXI.Text;

    public rate: number;

    constructor() {
        super();

        this.btn = new PIXI.Sprite();
        this.addChild(this.btn);

        this.state = 'normal';
        this.update();


        this.btn.buttonMode = true;
        this.btn.interactive = true;
        this.btn.addListener('pointerdown', this.onBtnClick);
        this.btn.addListener('pointerover', this.onBtnOver);
        this.btn.addListener('pointerout', this.onBtnOut);

        this.btn.interactiveChildren = false;


        this.panel = new RatePanel();
        this.addChild(this.panel).position.set(0, - 473);
        this.panel.addListener('change', this.onRateChange);


        this.lbl_rate = new PIXI.Text(this.panel.rate.toString() + 'x', {fontFamily: 'Bold', fontSize: 30, fill: 0xffffff, align: 'center'});
        this.btn.addChild(this.lbl_rate).position.set(this.btn.width / 2, this.btn.height / 2);
        this.lbl_rate.anchor.set(0.5, 0.5);


        this.rate = 1;
    }

    private onRateChange = (rate: number) => {
        HideTimer.instance.resume();

        this.rate = rate;
        this.lbl_rate.text = rate.toString() + 'x';
        this.panel.hide();
        this.state = 'normal';
        this.update();
        this.lbl_rate.style.fill = 0xffffff;
        this.emit('change', this.rate);
    }

    private update = () => {
        if (this.state == 'normal') {
            this.btn.texture = AssetsManager.instance.getTexture('btn_rate_normal');
            if (this.lbl_rate != null) this.lbl_rate.position.y = this.btn.height / 2;
        }
        else {
            this.btn.texture = AssetsManager.instance.getTexture('btn_rate_selected');
            if (this.lbl_rate != null) this.lbl_rate.position.y = this.btn.height / 2;
        }
    }


    private onBtnOver = () => {
        if (this.state == 'normal') {
            this.lbl_rate.style.fill = 0xffffff;
            this.btn.texture = AssetsManager.instance.getTexture('btn_rate_selected');
            if (this.lbl_rate != null) this.lbl_rate.position.y = this.btn.height / 2;
        }
    }

    private onBtnOut = () => {
        if (this.state == 'normal') {
            this.lbl_rate.style.fill = 0xffffff;
            this.btn.texture = AssetsManager.instance.getTexture('btn_rate_normal');
            if (this.lbl_rate != null) this.lbl_rate.position.y = this.btn.height / 2;
        }


    }

    private onBtnClick = () => {
        if (this.state == 'normal') {
            this.lbl_rate.style.fill = 0xffffff;
            this.state = 'selected';
            this.show_panel();
            this.update();
            HideTimer.instance.pause();
        }
        else {
            this.state = 'normal';
            this.lbl_rate.style.fill = 0xffffff;
            HideTimer.instance.resume();
            this.hide_panel();
            this.update();
        }
    }

    private show_panel = () => {
        this.panel.show();
    }

    private hide_panel = () => {
        this.panel.hide();
    }
}

class RatePanel extends PIXI.Sprite {
    private current_rate: number = 1;

    private items: Array<RateItem>;

    constructor() {
        super();
        this.texture = AssetsManager.instance.getTexture('rate_panel');
        this.visible = false;
        this.alpha = 0;

        this.items = new Array<RateItem>();


        for (let i: number = 0; i < 6; i++) {
            let item: RateItem = new RateItem(2 - i * 0.25);
            this.addChild(item).position.set(10, 10 + i * 72);
            item.addListener('select', this.onSelectItem);
            this.items.push(item);
        }
    }

    private onSelectItem = (item: RateItem) => {
        for (let i: number = 0; i < this.items.length; i++) {
            if (this.items[i] == item) this.items[i].selected = true;
            else this.items[i].selected = false;
        }

        this.emit('change', item.rate);
    }

    public show = () => {
        this.visible = true;
        gsap.to(this, {duration: 0.25, alpha: 1});
    }

    public hide = () => {
        gsap.to(this, {duration: 0.25, alpha: 0, onComplete: this.onHideComplete});
    }

    private onHideComplete = () => {
        this.visible = false;
    }

    public get rate(): number {
        return this.current_rate;
    }
}

class RateItem extends PIXI.Sprite {
    public rate: number = 1;
    private back: PIXI.Sprite;
    public lbl_rate: PIXI.Text;
    private _selected: boolean = false;

    constructor(rate: number) {
        super();
        this.rate = rate;
        this.back = AssetsManager.instance.getSprite('rate_item');
        this.addChild(this.back);
        this.back.alpha = 0;
        /*
        this.back.addListener('pointerdown', this.onClick);
        this.back.addListener('pointerover', this.onPointerOver);
        this.back.addListener('pointerout', this.onPointerOut);

        this.back.interactive = true;
        this.back.buttonMode = true;
        */

        this.lbl_rate = new PIXI.Text(this.rate.toString() + 'x', {fontFamily: 'Regular', fontSize: 30, fill: 0x303030, align: 'center'});
        this.addChild(this.lbl_rate).position.set(this.back.width / 2, this.back.height / 2 - 1);
        this.lbl_rate.anchor.set(0.5, 0.5);


        if (rate == 1) this.selected = true;

        let area: PIXI.Sprite = new PIXI.Sprite();
        area.texture = TextureHelper.createFillTexture(new PIXI.Point(this.back.width, this.back.height), rgba_create(0xffffff, 0));
        this.addChild(area);


        area.addListener('pointerover', this.onPointerOver);
        area.addListener('pointerout', this.onPointerOut);
        area.addListener('pointerdown', this.onClick);
        area.interactive = true;
        area.buttonMode = true;
    }

    private onPointerOver = () => {
        this.back.alpha = 1;
        if (this._selected == false) this.lbl_rate.style.fill = 0x303030;
        else this.lbl_rate.style.fill = 0xffffff;
    }

    private onPointerOut = () => {
        this.back.alpha = 0;
        if (this._selected == false) this.lbl_rate.style.fill = 0x303030;
        else this.lbl_rate.style.fill = 0xf0896b;
    }

    private onClick = () => {
        this.back.alpha = 0;
        this.emit('select', this);
    }

    public set selected(value: boolean) {
        this._selected = value;

        if (value == false) {
            this.back.alpha = 0.01;
            this.lbl_rate.style.fontFamily = 'Regular';
            this.lbl_rate.style.fill = 0x303030;
        }
        else {
            this.lbl_rate.style.fontFamily = 'Bold';
            this.lbl_rate.style.fill = 0xf0896b;
        }
    }
}