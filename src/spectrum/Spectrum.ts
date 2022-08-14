import * as PIXI from 'pixi.js';
import {Audio} from '../audio/Audio';

export class Spectrum extends PIXI.Sprite {
	private graph: PIXI.Graphics;

	constructor() {
		super();
		Audio.instance.addListener('spectrum', this.onData);

		this.graph = new PIXI.Graphics();
		this.addChild(this.graph);
		this.graph.lineStyle(3, 0xffff00);
	}

	private onData = (data: Uint8Array) => {
		this.graph.clear();
		let prev_data: number = 0;


		for (let i: number = 0; i < data.length; i++) {
			//this.graph.lineStyle(1, Math.random() * 0xffffff);
			this.graph.lineStyle(3, 0x005500);
			if (prev_data == 0) this.graph.moveTo(i, data[i]);
			else this.graph.lineTo(i, prev_data);
			prev_data = data[i];
		}
	}
}