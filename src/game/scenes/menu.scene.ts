import { Keys } from "../helpers/keys";

export class MenuScene extends Phaser.Scene {
	public create(): void {}

	public update(): void {}

	private startGame(): void {
		this.scene.start(Keys.Scenes.Game);
	}
}
