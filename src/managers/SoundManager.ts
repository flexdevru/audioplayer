import { sound } from '@pixi/sound';
import { AssetsManager } from '../managers/AssetsManager';

export class SoundManager {
	private static _instance: SoundManager;

	public static get instance(): SoundManager {
		if (SoundManager._instance == null) SoundManager._instance = new SoundManager();
		return SoundManager._instance;
	}

	constructor() {
		
	}

	public init = () => {

		let data: Object = AssetsManager.instance.getObject('sounds');

		for (let key in data) {
			let file_name: string = data[key];
		
			sound.add(key, {
				url: AssetsManager.SOUNDS + data[key],
				preload: true,
				loaded: function () {
					console.log('Duration: ', sound.duration(key), 'seconds');
				}
			});
		}
	}

	public play = (type: string) => {
		sound.stopAll()
		sound.play(type);
	}

	public stop = (type: string) => {
		sound.stop(type);
	}
}