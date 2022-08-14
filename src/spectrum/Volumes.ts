import * as PIXI from 'pixi.js';
import {Audio} from '../audio/Audio';

export class Volumes extends PIXI.Sprite {
	private graph: PIXI.Graphics;

	constructor() {
		super();
		Audio.instance.addListener('volume', this.onData);
		this.graph = new PIXI.Graphics();
		this.addChild(this.graph);
		this.graph.lineStyle(3, 0xffff00);
	}

	private onData = (data: Uint8Array) => {
		this.graph.clear();

		for (let i: number = 0; i < data.length; i++) {

			if (data[i] <= -200) break;
			this.graph.lineStyle(1, 0x550000);
			//this.graph.lineStyle(1, Math.random() * 0xffffff);
			this.graph.moveTo(i, 150);
			this.graph.lineTo(i, 50 - (100 + data[i]));

		}
	}
}