import "phaser";
import { Gameconfig } from "./game/helpers/types";
import { GameScene } from "./game/scenes/game.scene";

const config: Gameconfig = {
	width: 800,
	height: 600,
	parent: "thegame",
	scene: GameScene,
};

new Phaser.Game(config);
