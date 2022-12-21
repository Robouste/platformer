import { Keys } from "./helpers/keys";

export abstract class BaseScene extends Phaser.Scene {
	constructor(key: Keys.Scenes) {
		super(key);
	}

	public create(): void {
		this.sound.pauseOnBlur = false;
		// this.sound.mute = true;
	}

	public update(time: number, delta: number): void {
		this.input.keyboard.on(Keys.KeydownEvents.M, () => {
			this.sound.mute = !this.sound.mute;
		});
	}
}
