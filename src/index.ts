import "phaser";
import { Gameconfig } from "./game/helpers/types";
import { GameScene } from "./game/scenes/game.scene";
import { MainMenuScene } from "./game/scenes/main-menu.scene";
import { PreloadScene } from "./game/scenes/preload.scene";

const config: Gameconfig = {
	type: Phaser.WEBGL,
	width: 800,
	height: 600,
	parent: "thegame",
	scene: [PreloadScene, MainMenuScene, GameScene],
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 500 },
			debug: true,
		},
	},
};

new Phaser.Game(config);
