import * as PIXI from 'pixi.js';
import {Application} from '../Application';
//import { jsPDF } from "jspdf";
//---------- Point ----------

export class Point {
	public x: number = 0;
	public y: number = 0;

	constructor(x = 0, y = 0) {
		this.x = Number(x);
		this.y = Number(y);
	}

	public toString(): string {
		return 'x:' + this.x.toString() + ', y:' + this.y.toString();
	}
}

//---------- Rectangle ----------

export class Rectangle {
	public x: number = 0;
	public y: number = 0;
	public width: number = 0;
	public height: number = 0;

	constructor(x = 0, y = 0, width = 0, height = 0) {
		this.x = Number(x);
		this.y = Number(y);
		this.width = Number(width);
		this.height = Number(height);
	}

	public get area(): number {
		return this.width * this.height;
	}

	public get left(): number {
		return this.x;
	}

	public get right(): number {
		return this.x + this.width;
	}

	public get top(): number {
		return this.y;
	}

	public get bottom(): number {
		return this.y + this.height;
	}

	public get top_left(): Point {
		return new Point(this.x, this.y);
	}

	public get top_right(): Point {
		return new Point(this.right, this.y);
	}

	public get bottom_left(): Point {
		return new Point(this.x, this.bottom);
	}

	public get bottom_right(): Point {
		return new Point(this.right, this.bottom);
	}

	public toString(): string {
		return 'x:' + this.x.toString() + ', y:' + this.y.toString() + ', w:' + this.width.toString() + ', h:' + this.height.toString() + ', r:' + this.right.toString() + ', b:' + this.bottom.toString();
	}

	public hasPoint(point: Point): boolean {
		if (this.x <= point.x && this.right >= point.x && this.y <= point.y && this.bottom >= point.y) return true;
		return false;
	}

	public intersects(rectangle: Rectangle): boolean {
		return (rectangle.x <= this.x + this.width && this.x <= rectangle.x + rectangle.width && rectangle.y <= this.y + this.height && this.y <= rectangle.y + rectangle.height);
	}

	public intersection(rectangle: Rectangle): Rectangle {
		var x1 = rectangle.x, y1 = rectangle.y, x2 = x1 + rectangle.width, y2 = y1 + rectangle.height;
		if (this.x > x1) {x1 = this.x;}
		if (this.y > y1) {y1 = this.y;}
		if (this.x + this.width < x2) {x2 = this.x + this.width;}
		if (this.y + this.height < y2) {y2 = this.y + this.height;}
		return (x2 <= x1 || y2 <= y1) ? new Rectangle() : new Rectangle(x1, y1, x2 - x1, y2 - y1);
	}
}

//---------- RangeX ----------
export class RangeX {
	public left: number = 0;
	public right: number = 0;

	constructor(left: number = 0, right: number = 0) {
		this.left = left;
		this.right = right;
	}

	public get width(): number {
		return this.right - this.left;
	}

	public toString(): string {
		return 'l:' + this.left.toString() + ', r:' + this.right.toString() + ', w:' + this.width.toString();
	}

	public hasPoint(point: number): boolean {
		if (this.left <= point && this.right >= point) return true;
		return false;
	}

}

export class Base64 {
	constructor() {
	}

	public decode(data: string): string {
		let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		let o1, o2, o3, h1, h2, h3, h4, bits, i = 0, enc = '';

		do {  // unpack four hexets into three octets using index points in b64
			h1 = b64.indexOf(data.charAt(i++));
			h2 = b64.indexOf(data.charAt(i++));
			h3 = b64.indexOf(data.charAt(i++));
			h4 = b64.indexOf(data.charAt(i++));

			bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

			o1 = bits >> 16 & 0xff;
			o2 = bits >> 8 & 0xff;
			o3 = bits & 0xff;

			if (h3 == 64) enc += String.fromCharCode(o1);
			else if (h4 == 64) enc += String.fromCharCode(o1, o2);
			else enc += String.fromCharCode(o1, o2, o3);
		} while (i < data.length);

		return enc;
	}
}

export class Trigonometry {
	public static deg2rad(value: number): number {
		return value * Math.PI / 180;
	}

	public static rad2deg(value: number): number {
		return value * 180 / Math.PI;
	}
}

export class TransparencyHitArea implements PIXI.IHitArea {

	private pixelData: Uint8ClampedArray;
	private width: number = 0;
	private height: number = 0;

	constructor(source: PIXI.Sprite) {

		let canvas: HTMLCanvasElement = Application.instance.renderer.plugins.extract.canvas(source);
		let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
		this.pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

		this.width = canvas.width;
		this.height = canvas.height;
	}

	public getPixel = (x: number, y: number): number => {

		let index = (x + y * this.width) * 4 + 3;
		let value: number = this.pixelData[index];
		return value;
	}

	public contains = (x: number, y: number): boolean => {

		if (x < 0 || y < 0 || x > this.width || y > this.height) return false;
		x = Math.floor(x);
		y = Math.floor(y);
		let index: number = (x + y * this.width) * 4 + 3;
		let value: number = this.pixelData[index];
		if (value > 0) return true;
		return false;
	}
}

export class DottedLine extends PIXI.Sprite {
	private direction: string;
	private distance: number;

	constructor(distance: number, direction: string, color: number, weight: number, strong: number = 3) {
		super();
		this.distance = distance;
		this.direction = direction;

		let graph: PIXI.Graphics = new PIXI.Graphics();
		graph.lineStyle(weight, color);

		if (this.direction == 'horizontal') {
			let last_x: number = 0;
			while (last_x < distance) {
				graph.moveTo(last_x, 0);
				graph.lineTo(last_x + strong, 0);
				last_x = last_x + strong * 2;
			}
		}
		else {
			let last_y: number = 0;
			while (last_y < distance) {
				graph.moveTo(0, last_y);
				graph.lineTo(0, last_y + strong);
				last_y = last_y + strong * 2;
			}

		}

		this.texture = Application.instance.renderer.generateTexture(graph);
		this.addChild(graph);

	}
}

export class TextureHelper {

	public static createGradientCanvas = (size: PIXI.Point, colors: Array<string>, points: Array<PIXI.Point>, shadow?: Shadow): HTMLCanvasElement => {
		let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
		canvas.width = size.x;
		canvas.height = size.y;

		if (shadow != null) {
			canvas.width = canvas.width + shadow.shadowOffsetX + shadow.shadowBlur;
			canvas.height = canvas.height + shadow.shadowOffsetY + shadow.shadowBlur;
		}

		let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

		let grd: CanvasGradient = ctx.createLinearGradient(points[0].x, points[0].y, points[1].x, points[1].y);
		grd.addColorStop(0, colors[0]);
		grd.addColorStop(1, colors[1]);

		ctx.fillStyle = grd;

		if (shadow != null) {
			ctx.shadowColor = shadow.shadowColor;
			ctx.shadowBlur = shadow.shadowBlur;
			ctx.shadowOffsetX = shadow.shadowOffsetX;
			ctx.shadowOffsetY = shadow.shadowOffsetY;
		}

		ctx.fillRect(0, 0, size.x, size.y);

		return canvas;
	}

	public static createRoundedGradientCanvas = (size: PIXI.Point, colors: Array<string>, points: Array<PIXI.Point>, radius: number = 0, shadow?: Shadow): HTMLCanvasElement => {
		let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
		canvas.width = size.x;
		canvas.height = size.y;

		if (shadow != null) {
			canvas.width = canvas.width + shadow.shadowOffsetX + shadow.shadowBlur;
			canvas.height = canvas.height + shadow.shadowOffsetY + shadow.shadowBlur;
		}

		let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

		let grd: CanvasGradient = ctx.createLinearGradient(points[0].x, points[0].y, points[1].x, points[1].y);
		grd.addColorStop(0, colors[0]);
		grd.addColorStop(1, colors[1]);

		ctx.fillStyle = grd;

		if (shadow != null) {
			ctx.shadowColor = shadow.shadowColor;
			ctx.shadowBlur = shadow.shadowBlur;
			ctx.shadowOffsetX = shadow.shadowOffsetX;
			ctx.shadowOffsetY = shadow.shadowOffsetY;
		}

		if (radius == 0) ctx.fillRect(0, 0, size.x, size.y);
		else roundRect(ctx, 0, 0, size.x, size.y, radius, grd, false);

		return canvas;
	}

	public static createRoundedCanvas = (width: number, height: number, fill: string, strokeColor: string, strokeWidth: number, radius: number, offset: number = 0): HTMLCanvasElement => {
		let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
		canvas.width = width + strokeWidth * 2;
		canvas.height = height + strokeWidth * 2;


		let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

		ctx.fillStyle = fill;
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = strokeWidth;
		roundRect(ctx, strokeWidth, strokeWidth, width, height, radius, fill, true);

		return canvas;
	}

	public static createRoundedTexture_old = (width: number, height: number, fill: string, strokeColor: string, strokeWidth: number, radius: number, offset: number = 0): Promise<PIXI.Texture> => {
		return PIXI.Texture.fromLoader(TextureHelper.createRoundedCanvas(width, height, fill, strokeColor, strokeWidth, radius, offset), '');
	}

	public static createRoundedTexture = (width: number, height: number, fill: string, strokeColor: string, strokeWidth: number, radius: number, offset: number = 0): PIXI.Texture => {

		let bt: PIXI.BaseTexture = PIXI.BaseTexture.from(TextureHelper.createRoundedCanvas(width, height, fill, strokeColor, strokeWidth, radius, offset));
		return new PIXI.Texture(bt);
	}

	public static createFillCanvas = (size: PIXI.Point, color: string, shadow?: Shadow): HTMLCanvasElement => {
		let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
		canvas.width = size.x;
		canvas.height = size.y;

		if (shadow != null) {
			canvas.width = canvas.width + shadow.shadowOffsetX + shadow.shadowBlur;
			canvas.height = canvas.height + shadow.shadowOffsetY + shadow.shadowBlur;
		}

		let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

		ctx.fillStyle = color;

		if (shadow != null) {
			ctx.shadowColor = shadow.shadowColor;
			ctx.shadowBlur = shadow.shadowBlur;
			ctx.shadowOffsetX = shadow.shadowOffsetX;
			ctx.shadowOffsetY = shadow.shadowOffsetY;
		}

		ctx.fillRect(0, 0, size.x, size.y);

		return canvas;
	}

	public static createFillCanvasEx = (size: PIXI.Point, color: string, shadow?: Shadow): HTMLCanvasElement => {
		let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
		canvas.width = size.x;
		canvas.height = size.y;

		if (shadow != null) {
			canvas.width = canvas.width + shadow.shadowOffsetX + 2 * shadow.shadowBlur;
			canvas.height = canvas.height + shadow.shadowOffsetY + 2 * shadow.shadowBlur;
		}

		let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

		ctx.fillStyle = color;

		if (shadow != null) {
			ctx.shadowColor = shadow.shadowColor;
			ctx.shadowBlur = shadow.shadowBlur;
			ctx.shadowOffsetX = shadow.shadowOffsetX;
			ctx.shadowOffsetY = shadow.shadowOffsetY;

			ctx.fillRect(shadow.shadowBlur - shadow.shadowOffsetX, shadow.shadowBlur - shadow.shadowOffsetY, size.x, size.y);
		}
		else {
			ctx.fillRect(0, 0, size.x, size.y);
		}

		return canvas;
	}

	public static createGradientTexture = (size: PIXI.Point, colors: Array<string>, points: Array<PIXI.Point>, shadow?: Shadow): PIXI.Texture => {

		let canvas: HTMLCanvasElement = TextureHelper.createGradientCanvas(size, colors, points, shadow);
		let texture: PIXI.Texture = new PIXI.Texture(PIXI.BaseTexture.from(canvas));
		return texture;
	}

	public static createFillTexture = (size: PIXI.Point, color: string, shadow?: Shadow): PIXI.Texture => {
		let canvas: HTMLCanvasElement = TextureHelper.createFillCanvas(size, color, shadow);
		let texture: PIXI.Texture = new PIXI.Texture(PIXI.BaseTexture.from(canvas));
		return texture;
	}

	public static createFillTextureEx = (size: PIXI.Point, color: string, shadow?: Shadow): PIXI.Texture => {
		let canvas: HTMLCanvasElement = TextureHelper.createFillCanvasEx(size, color, shadow);
		let texture: PIXI.Texture = new PIXI.Texture(PIXI.BaseTexture.from(canvas));
		return texture;
	}
}

export class GraphicsHelper {
	public static createLine = (width: number, height: number, color: number, alpha: number = 1): PIXI.Graphics => {
		let line: PIXI.Graphics = new PIXI.Graphics();

		line.beginFill(color, alpha);
		line.drawRect(0, 0, width, height);
		line.endFill();
		return line;
	}

	public static createFill = (fillColor: number = 0xffffff, fillAlpha: number = 1): PIXI.Graphics => {
		return GraphicsHelper.createRect(Application.WIDTH, Application.HEIGHT, fillColor, fillAlpha);
	}

	public static createRect = (width: number, height: number, fillColor: number = 0xffffff, fillAlpha: number = 1, borderWidth: number = 0, borderColor: number = 0, borderAlpha: number = 1): PIXI.Graphics => {
		let rect: PIXI.Graphics = new PIXI.Graphics();

		rect.beginFill(fillColor, fillAlpha);
		rect.drawRect(0, 0, width, height);
		rect.endFill();

		let line: PIXI.Graphics;

		line = GraphicsHelper.createLine(borderWidth, height, borderColor, borderAlpha);
		rect.addChild(line).position.set(0, 0);

		line = GraphicsHelper.createLine(borderWidth, height, borderColor, borderAlpha);
		rect.addChild(line).position.set(width - borderWidth, 0);

		line = GraphicsHelper.createLine(width, borderWidth, borderColor, borderAlpha);
		rect.addChild(line).position.set(0, 0);

		line = GraphicsHelper.createLine(width, borderWidth, borderColor, borderAlpha);
		rect.addChild(line).position.set(0, height - borderWidth);

		return rect;
	}

	public static createDottedRect = (width: number, height: number, fillColor: number, fillAlpha: number, borderWidth: number, borderColor: number, borderAlpha: number, borderGap: number = 6): PIXI.Graphics => {
		let rect: PIXI.Graphics = GraphicsHelper.createRect(width, height, fillColor, fillAlpha, borderWidth, borderColor, 0)

		rect.addChild(new DottedLine(width, 'horizontal', borderColor, borderWidth, borderGap)).position.set(0, 0);
		rect.addChild(new DottedLine(width, 'horizontal', borderColor, borderWidth, borderGap)).position.set(0, height);

		rect.addChild(new DottedLine(height, 'vertical', borderColor, borderWidth, borderGap)).position.set(0, 0);
		rect.addChild(new DottedLine(height, 'vertical', borderColor, borderWidth, borderGap)).position.set(width, 0);

		return rect;
	}

	public static createMask = (width: number, height: number, radius: number = 0): PIXI.Graphics => {
		let rect: PIXI.Graphics = new PIXI.Graphics();

		rect.beginFill(0xffffff);
		if (radius == 0) rect.drawRect(0, 0, width, height);
		else rect.drawRoundedRect(0, 0, width, height, radius);
		rect.endFill();

		return rect;
	}

	public static createRoundedRect = (width: number, height: number, fillColor: number = 0xffffff, fillAlpha: number = 1, radius: number = 0, border?: Object): PIXI.Graphics => {
		let rect: PIXI.Graphics = new PIXI.Graphics();

		if (border != null) rect.lineStyle(border['width'], border['fill'], border['alpha']);
		rect.beginFill(fillColor, fillAlpha);
		if (radius == 0) rect.drawRect(0, 0, width, height);
		else rect.drawRoundedRect(0, 0, width, height, radius);
		rect.endFill();

		return rect;
	}

	public static createCircle = (width: number, fillColor: number = 0xffffff, fillAlpha: number = 1, border?: Object): PIXI.Graphics => {
		let rect: PIXI.Graphics = new PIXI.Graphics();

		if (border != null) rect.lineStyle(border['width'], border['fill'], border['alpha']);
		rect.beginFill(fillColor, fillAlpha);
		rect.drawCircle(width / 2, width / 2, width / 2);
		rect.endFill();

		return rect;
	}

	public static createPoligon = (points: Array<PIXI.Point>, fillColor: number = 0xffffff, fillAlpha: number = 1, border?: Object): PIXI.Graphics => {
		let rect: PIXI.Graphics = new PIXI.Graphics();

		if (border != null) rect.lineStyle(border['width'], border['fill'], border['alpha']);
		rect.beginFill(fillColor, fillAlpha);

		for (let i: number = 0; i < points.length; i++) {
			if (i == 0) rect.moveTo(points[i].x, points[i].y);
			else rect.lineTo(points[i].x, points[i].y);
		}

		rect.endFill();

		return rect;
	}

}

export class Shadow extends Object {
	public shadowColor: string = 'rgba(0, 0, 0, 0.5)';
	public shadowBlur: number = 7;
	public shadowOffsetX: number = 0;
	public shadowOffsetY: number = 2;

	constructor() {
		super();
	}
}

export class SaveImage {
	private fileName: string = '';

	constructor() {

	}

	public save = (path: string, fileName: string) => {
		this.fileName = fileName;
		let img: HTMLImageElement = document.createElement('img') as HTMLImageElement;
		img.onload = this.onImageLoad;
		img.src = path;
	}

	public saveCanvas = (canvas: HTMLCanvasElement, fileName: string) => {
		this.fileName = fileName;
		let binStr = atob(canvas.toDataURL('image/png').split(',')[1]);
		let len: number = binStr.length;
		let arr: Uint8Array = new Uint8Array(len);

		for (var i = 0; i < len; i++) {
			arr[i] = binStr.charCodeAt(i);
		}

		let blob: Blob = new Blob([arr]);

		this.saveData(blob, this.fileName);
	}

	private onImageLoad = (event: Event) => {
		let img: HTMLImageElement = event.currentTarget as HTMLImageElement;
		let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
		canvas.width = img.width;
		canvas.height = img.height;

		let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.drawImage(img, 0, 0);

		let binStr = atob(canvas.toDataURL('image/png').split(',')[1]);
		let len: number = binStr.length;
		let arr: Uint8Array = new Uint8Array(len);

		for (var i = 0; i < len; i++) {
			arr[i] = binStr.charCodeAt(i);
		}

		let blob: Blob = new Blob([arr]);

		this.saveData(blob, this.fileName);
	}

	private saveData = (data: Blob, fileName: string) => {
		var a: any = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		var url = window.URL.createObjectURL(data);
		a.href = url;
		a.download = fileName;
		a.click();
		window.URL.revokeObjectURL(url);
	}
	/*
		public saveCanvasToPDF = (canvas: HTMLCanvasElement, fileName: string) => {
			console.log('canvas', canvas.width, canvas.height);
			this.fileName = fileName;
			
			let pdf = new jsPDF({orientation: 'l', unit: 'px', format: [canvas.width, canvas.height]});
			pdf.addImage(canvas, 'PNG', 0, 0, canvas.width, canvas.height);
			pdf.save(this.fileName);
		}
	
		public saveToPDF = (source: PIXI.DisplayObject, fileName: string) => {
	
			let canvas: HTMLCanvasElement = Application.instance.renderer.plugins.extract.canvas(source);
			console.log('canvas', canvas.width, canvas.height);
			this.fileName = fileName;
			let pdf = new jsPDF({ orientation: 'l', unit: 'px', format: [canvas.width, canvas.height] });
			pdf.addImage(canvas, 'PNG', 0, 0, canvas.width, canvas.height);
			pdf.save(this.fileName);
		}
		*/
}

export var rgba_create = function (color: number, alpha: number = 1): string {
	let r: number = (color >> 16) & 255;
	let g: number = (color >> 8) & 255;
	let b: number = color & 255;
	let a: number = alpha;

	return 'rgba(' + [r, g, b, a].join(',') + ')';
}


export function parse_point(value: string): PIXI.Point {
	let tmp: Array<string> = value.split(':');
	return new PIXI.Point(Number(tmp[0]), Number(tmp[1]));
}

export function parse_rect(value: string): Rectangle {
	let tmp: Array<string> = value.split(':');
	return new Rectangle(Number(tmp[0]), Number(tmp[1]), Number(tmp[2]), Number(tmp[3]));
}

export class ArrayEx<T> extends Array {
	constructor(data: Array<T>) {
		super();
		while (data.length > 0) this.unshift(data.pop());
	}

	public randomize = (count: number = 3) => {
		while (count-- > 0) {
			this.sort(this._randomize);
		}
	}

	private _randomize = (val1: Object, val2: Object): number => {

		if (Math.random() > 0.5) return 1;
		return -1;
	}
}

export class TableIteratior {
	private x: number;
	private y: number;
	private dx: number;
	private dy: number;
	private cols: number;

	private x_init: number;
	private y_init: number;

	private index: number;

	private last_delta: number = 0;
	private odd_row: number = 0;
	private row: number = 1;

	private even_index: number = -1;

	constructor(x: number, y: number, dx: number, dy: number, cols: number, odd_row: number = 0) {
		this.x_init = x;
		this.y_init = y;
		this.dx = dx;
		this.dy = dy;
		this.cols = cols;

		this.index = -1;

		this.x = this.x_init;
		this.y = this.y_init;

		this.odd_row = odd_row;
		if (this.odd_row > 0) this.last_delta = dx / 2;
	}

	public next = (): PIXI.Point => {
		this.index++;
		this.even_index++;
		this.x = this.x_init + this.index * this.dx;
		let res: PIXI.Point = new PIXI.Point(this.x, this.y);

		if (this.index == this.cols - 1) {
			this.row++;

			this.x = this.x_init;
			this.y = this.y + this.dy;
			this.index = -1;

			if (this.row == this.odd_row) {
				this.x_init = this.x_init + this.last_delta;
			}
		}

		return res;
	}

	public get even(): boolean {
		if ((this.even_index / 2) - Math.floor(this.even_index / 2) == 0) return true;
		return false;
	}
}

export function b64DecodeUnicode(str: string): string {
	return decodeURIComponent(atob(str).split('').map(function (c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number | string, fill: string | CanvasGradient, stroke: boolean): void {
	if (typeof stroke == 'undefined') {
		stroke = true;
	}

	if (typeof radius === 'undefined') {
		radius = 5;
	}

	if (typeof radius === 'number') {
		var radiuses: any = {tl: radius, tr: radius, br: radius, bl: radius};
	} else {
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		for (var side in defaultRadius) {
			radiuses[side] = radiuses[side] || defaultRadius[side];
		}
	}

	ctx.beginPath();
	ctx.moveTo(x + radiuses.tl, y);
	ctx.lineTo(x + width - radiuses.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radiuses.tr);
	ctx.lineTo(x + width, y + height - radiuses.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radiuses.br, y + height);
	ctx.lineTo(x + radiuses.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radiuses.bl);
	ctx.lineTo(x, y + radiuses.tl);
	ctx.quadraticCurveTo(x, y, x + radiuses.tl, y);
	ctx.closePath();

	if (fill) {
		ctx.fill();
	}
	if (stroke) {
		ctx.stroke();
	}
}