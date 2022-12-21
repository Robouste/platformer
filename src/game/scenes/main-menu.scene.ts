import { BaseScene } from "../base.scene";
import { Keys } from "../helpers/keys";
import { BaseSound, GameText } from "../helpers/types";

export class MainMenuScene extends BaseScene {
	private newGameText: GameText;
	private exitGameText: GameText;
	private music: BaseSound;

	constructor() {
		super(Keys.Scenes.MainMenu);
	}

	public create(): void {
		super.create();

		this.newGameText = this.add
			.text(+this.game.config.width / 2, +this.game.config.height / 2 - 72, "New game", { fontSize: "72px", color: "#fff" })
			.setOrigin(0.5, 0.5)
			.setInteractive();

		this.exitGameText = this.add
			.text(+this.game.config.width / 2, +this.game.config.height / 2 + 72, "Exit game", { fontSize: "72px", color: "#fff" })
			.setOrigin(0.5, 0.5)
			.setInteractive();

		this.music = this.sound.add(Keys.Musics.MainMenu, { loop: true });

		this.music.play();
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);

		this.newGameText.on(Keys.MouseEvents.PointerDown, () => this.startGame());
		this.exitGameText.on(Keys.MouseEvents.PointerDown, () => this.exitGame());
	}

	private startGame(): void {
		this.music.destroy();
		this.scene.start(Keys.Scenes.Game);
	}

	private exitGame(): void {
		this.game.destroy(true, true);
	}
}
