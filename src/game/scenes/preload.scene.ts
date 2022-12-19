import { Keys } from "../helpers/keys";

export class PreloadScene extends Phaser.Scene {
	constructor() {
		super(Keys.Scenes.Preload);
	}

	public preload(): void {
		this.load.tilemapTiledJSON(Keys.Tiles.Map, "assets/map.json");
		this.load.spritesheet(Keys.Sprites.Tiles, "assets/tiles.png", { frameWidth: 70, frameHeight: 70 });
		this.load.image(Keys.Images.Coin, "assets/coinGold.png");
		this.load.atlas(Keys.Atlases.Player, "assets/player.png", "assets/player.json");
	}

	public create(): void {
		this.scene.start(Keys.Scenes.Game);
	}
}
