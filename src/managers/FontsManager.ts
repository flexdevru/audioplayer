import WebFont = require('webfontloader');
import { FontsParams } from '../utils/FontsParams';

export class FontsManager {
	private static _instance: FontsManager;

	public static get instance(): FontsManager {
		if (FontsManager._instance == null) FontsManager._instance = new FontsManager();
		return FontsManager._instance;
	}

	constructor() {
	}

	public init = (onLoad: () => void) => {
		WebFont.load({
			custom:
			{
				families: FontsParams.FONTS,
				urls: ['fonts/fonts.css']
			},
			active: function () { onLoad() },
		})
	}
}