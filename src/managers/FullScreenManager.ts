export class FullScreenManager {
	private static _instance: FullScreenManager;
	public static currentScale: number = 1;

	private elements!: Array<HTMLElement>;

	private backgroundColor: string = '#ffffff';

	public static get instance(): FullScreenManager {
		if (FullScreenManager._instance == null) FullScreenManager._instance = new FullScreenManager();
		return FullScreenManager._instance;
	}

	constructor() {

	}

	public init(elements: Array<HTMLElement>, backgroundColor = '#ffffff'): void {
		this.elements = elements;
		this.backgroundColor = backgroundColor;
	}

	public centerFit(): void {
		let scaleX: number = window.innerWidth / this.elements[0].offsetWidth;
		let scaleY: number = window.innerHeight / this.elements[0].offsetHeight;
		let scale: number = Math.min(scaleX, scaleY);

		if (scale >= 1) this.center();
		else this.scale();

	}

	public center(): void {
		if (this.elements[0] == null) return;
		let marginW: number = (window.innerWidth - this.elements[0].offsetWidth) / 2;
		let marginH: number = (window.innerHeight - this.elements[0].offsetHeight) / 2;


		for (let i: number = 0; i < this.elements.length; i++) {
			this.elements[i].style.transform = 'scale(1)';
			this.elements[i].style.marginLeft = marginW + 'px';
			this.elements[i].style.marginRight = marginW + 'px';
			this.elements[i].style.marginTop = marginH + 'px';
			this.elements[i].style.marginBottom = marginH + 'px';
		}

		document.body.style.backgroundColor = this.backgroundColor;

		FullScreenManager.currentScale = 1;
	}

	public scale(): void {
		if (this.elements[0] == null) return;
		let scaleX: number;
		let scaleY: number;
		let scale: number;
		let center: string;
		let margin: number;

		scaleX = window.innerWidth / this.elements[0].offsetWidth;
		scaleY = window.innerHeight / this.elements[0].offsetHeight;

		scale = Math.min(scaleX, scaleY);

		if (FullScreenManager.currentScale == scale) return;

		for (let i: number = 0; i < this.elements.length; i++) {
			this.elements[i].style.transformOrigin = '0 0';
			this.elements[i].style.transform = 'scale(' + scale + ')';
		}

		if (this.elements[0].offsetWidth > this.elements[0].offsetHeight) {
			if (this.elements[0].offsetWidth * scale < window.innerWidth) {
				center = 'horizontally';
			}
			else {
				center = 'vertically';
			}
		}
		else {
			if (this.elements[0].offsetHeight * scale < window.innerHeight) {
				center = 'vertically';
			} else {
				center = 'horizontally';
			}
		}

		if (center === 'horizontally') {
			margin = (window.innerWidth - this.elements[0].offsetWidth * scale) / 2;

			for (let i: number = 0; i < this.elements.length; i++) {
				this.elements[i].style.marginTop = '0';
				this.elements[i].style.marginBottom = '0';
				this.elements[i].style.marginLeft = margin + 'px';
				this.elements[i].style.marginRight = margin + 'px';
			}
		}

		if (center === 'vertically') {
			margin = (window.innerHeight - this.elements[0].offsetHeight * scale) / 2;

			for (let i: number = 0; i < this.elements.length; i++) {
				this.elements[i].style.marginTop = margin + 'px';
				this.elements[i].style.marginBottom = margin + 'px';
				this.elements[i].style.marginLeft = '0';
				this.elements[i].style.marginRight = '0';
			}
		}

		document.body.style.backgroundColor = this.backgroundColor;

		FullScreenManager.currentScale = scale;
	}
}