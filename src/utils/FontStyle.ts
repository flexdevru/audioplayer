import { TextStyleSet } from 'pixi-multistyle-text';

export class FontStyle {
	private _style: TextStyleSet;

	constructor(fontFamily: string, fontSize: number = 14) {
		
		this._style = {
			default: { fontFamily: fontFamily, fontSize: fontSize, fill: 0x000001, trim: true }
		};
	}

	public get multistyle(): TextStyleSet {
		return this._style;
	}

	public get style(): Object {
		return this._style['default'];
	}

	public setStyles = (values: Object): FontStyle => {
		for (var key in values) {
			this._style['default'][key] = values[key];
		}

		return this;
	}

	public fontSize = (value: number): FontStyle => {
		this._style['default']['fontSize'] = value
		return this;
	}

	public fill = (value: number): FontStyle => {
		if (value == 0x000000) value = 0x000001;
		this._style['default']['fill'] = value
		return this;
	}

	public white = (): FontStyle => {
		this._style['default']['fill'] = 0xffffff;
		return this;
	}

	public black = (): FontStyle => {
		this._style['default']['fill'] = 0x000001;
		return this;
	}

	public wordWrap = (value: number = -1): FontStyle => {
		if (value == -1) value = 4096;
		this._style['default']['wordWrap'] = true;
		this._style['default']['wordWrapWidth'] = value;
		this._style['default']['breakWords'] = true;
		return this;
	}

	public align = (value: string): FontStyle => {
		this._style['default']['align'] = value;
		return this;
	}

	public left = (): FontStyle => {
		this._style['default']['align'] = 'left';
		return this;
	}

	public right = (): FontStyle => {
		this._style['default']['align'] = 'right';
		return this;
	}

	public center = (): FontStyle => {
		this._style['default']['align'] = 'center';
		return this;
	}

	public lineHeight = (value: number): FontStyle => {
		this._style['default']['lineHeight'] = value
		return this;
	}

	private iterationCopy = (src: Object): Object => {
		let target: Object = new Object();
		for (let prop in src) {
			if (src.hasOwnProperty(prop)) {
				if (this.isObject(src[prop])) {
					target[prop] = this.iterationCopy(src[prop]);
				}
				else {
					target[prop] = src[prop];
				}
			}
		}
		return target;
	}

	private isObject(obj: any): boolean {
		var type = typeof obj;
		return type === 'function' || type === 'object' && !!obj;
	}

	public addTag = (name: string, style: FontStyle): FontStyle => {
		
		this._style[name] = style.style;
		return this;
	}
}
