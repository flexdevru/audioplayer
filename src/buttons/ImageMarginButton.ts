import * as PIXI from 'pixi.js';
import {AssetsManager} from '../managers/AssetsManager';

export class ImageMarginButton extends PIXI.Sprite {

	private type: string;
	private pressed: boolean = false;

	constructor(type: string, margin: number | Array<number> = 0) {

		super();
		this.type = type;

		this.texture = AssetsManager.instance.getTexture(this.type);
		this.enabled = true;


		if (typeof margin == 'number') {
			this.hitArea = new PIXI.Rectangle(margin, margin, this.width - margin * 2, this.height - margin * 2);
		}
		else {
			let margins: Array<number> = margin as Array<number>;
			this.hitArea = new PIXI.Rectangle(margins[0], margins[1], this.width - (margins[0] + margins[2]), this.height - (margins[1] + margins[3]));
		}
	}

	public set enabled(value: boolean) {
		if (value) {
			this.interactive = true;
			this.buttonMode = true;
			this.addListener('pointerover', this.onPointerEvent);
			this.addListener('pointerdown', this.onPointerEvent);
			this.addListener('pointerup', this.onPointerEvent);
			this.addListener('pointerupoutside', this.onPointerEvent);
			this.addListener('pointerout', this.onPointerEvent);
			this.texture = AssetsManager.instance.getTexture(this.type);
			this.alpha = 1;
		}
		else {
			this.interactive = false;
			this.buttonMode = false;
			this.removeAllListeners('pointerover');
			this.removeAllListeners('pointerdown');
			this.removeAllListeners('pointerup');
			this.removeAllListeners('pointerupoutside');
			this.removeAllListeners('pointerout');
			this.texture = AssetsManager.instance.getTexture(this.type);
			this.alpha = 0.5;
		}
	}

	private onPointerEvent = (event: MouseEvent) => {

		switch (event.type) {

			case 'pointerover':

				this.texture = AssetsManager.instance.getTexture(this.type + '_over');
				break;

			case 'pointerout':

				this.texture = AssetsManager.instance.getTexture(this.type);
				break;

			case 'pointerdown':

				this.texture = AssetsManager.instance.getTexture(this.type + '_over');
				this.pressed = true;
				break;

			case 'pointerupoutside':

				this.texture = AssetsManager.instance.getTexture(this.type);
				this.pressed = false;
				break;

			case 'pointerup':

				this.texture = AssetsManager.instance.getTexture(this.type);
				if (this.pressed == true) this.emit('press');
				this.pressed = false;
				break;

		}
	}
}