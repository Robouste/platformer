import { Keys } from "../helpers/keys";

export class PreloadScene extends Phaser.Scene {
	constructor() {
		super(Keys.Scenes.Preload);
	}
	public preload(): void {}

	public create(): void {
		this.scene.start(Keys.Scenes.Game);
	}
}
