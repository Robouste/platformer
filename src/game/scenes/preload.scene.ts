import { Keys } from "../helpers/keys";

export class PreloadScene extends Phaser.Scene {
	constructor() {
		super(Keys.Scenes.Preload);
	}

	public preload(): void {
		this.load.tilemapTiledJSON(Keys.Tiles.Map, "assets/tiles/map.json");

		this.load.spritesheet(Keys.Sprites.Tiles, "assets/tiles/tiles.png", { frameWidth: 70, frameHeight: 70 });

		this.load.image(Keys.Images.Coin, "assets/images/coinGold.png");
		this.load.image(Keys.Images.GlassPanel, "assets/images/glassPanel.png");
		this.load.image(Keys.Images.CursorHand, "assets/images/cursor_hand.png");

		this.load.atlas(Keys.Atlases.Player, "assets/sprites/player.png", "assets/sprites/player.json");
		this.load.atlas(Keys.Atlases.Attack, "assets/sprites/attack.png", "assets/sprites/attack.json");
		this.load.atlas(Keys.Atlases.P_Run, "assets/sprites/p_run.png", "assets/sprites/p_run.json");
		this.load.atlas(Keys.Atlases.P_Attack, "assets/sprites/p_attack.png", "assets/sprites/p_attack.json");

		this.load.audio(Keys.Musics.MainMenu, "assets/audio/musics/00.mp3");
		this.load.audio(Keys.Musics.Level1, "assets/audio/musics/01.mp3");

		this.load.audio(Keys.Sfx.Collect, "assets/audio/sfx/collect.mp3");
		this.load.audio(Keys.Sfx.Jump, "assets/audio/sfx/hero_jump.wav");
		this.load.audio(Keys.Sfx.Land, "assets/audio/sfx/hero_land_soft.wav");
		this.load.audio(Keys.Sfx.Attack, "assets/audio/sfx/attack.wav");
	}

	public create(): void {
		this.scene.start(Keys.Scenes.MainMenu);
		// this.scene.start(Keys.Scenes.Game);
	}
}
