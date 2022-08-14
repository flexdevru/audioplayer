import * as PIXI from 'pixi.js';
import {Audio} from '../audio/Audio';

export class RoundSpectrum extends PIXI.Sprite {
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

		let min_angle: number = 2 * Math.PI / data.length;

		for (let i: number = 0; i < data.length; i++) {
			this.graph.lineStyle(3, Math.random() * 0xffffff);
			let angle: number = min_angle * i;

			let x: number = Math.sin(angle) * data[i] + 300;
			let y: number = Math.cos(angle) * data[i] + 300;


			if (i == 0) this.graph.moveTo(x, y);
			else this.graph.lineTo(x, y);
		}
	}
}