import { BaseScene } from "../base.scene";
import { Keys } from "../helpers/keys";
import { BaseSound, CursorKeys, Image, KeyboardKey } from "../helpers/types";

export class MainMenuScene extends BaseScene {
	private music: BaseSound;
	private startingScene: boolean;
	private cursors: CursorKeys;
	private buttons: Image[] = [];
	private selectedButtonIndex: number = 0;
	private buttonSelector: Image;
	private enterKey: KeyboardKey;

	constructor() {
		super(Keys.Scenes.MainMenu);
	}

	public init(): void {
		this.cursors = this.input.keyboard.createCursorKeys();
		this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
	}

	public create(): void {
		super.create();

		const { width, height } = this.scale;

		// Play button
		const playButton = this.add.image(width * 0.5, height * 0.6, Keys.Images.GlassPanel).setDisplaySize(150, 50);
		this.add.text(playButton.x, playButton.y, "Play").setOrigin(0.5);

		// Settings button
		const settingsButton = this.add
			.image(playButton.x, playButton.y + playButton.displayHeight + 10, Keys.Images.GlassPanel)
			.setDisplaySize(150, 50);
		this.add.text(settingsButton.x, settingsButton.y, "Settings").setOrigin(0.5);

		this.buttons.push(playButton);
		this.buttons.push(settingsButton);

		this.buttonSelector = this.add.image(0, 0, Keys.Images.CursorHand);

		this.selectButton(0);

		playButton.on(Keys.Events.Selected, () => this.startGame());
		settingsButton.on(Keys.Events.Selected, () => this.exitGame());

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			playButton.off(Keys.Events.Selected);
			settingsButton.off(Keys.Events.Selected);
		});

		this.music = this.sound.add(Keys.Musics.MainMenu, { loop: true });
		this.music.play();
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);

		const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
		const enterJustPressed = Phaser.Input.Keyboard.JustDown(this.enterKey);

		if (upJustPressed) {
			this.selectNextButton(-1);
		} else if (downJustPressed) {
			this.selectNextButton(1);
		} else if (spaceJustPressed || enterJustPressed) {
			this.confirmSelection();
		}
	}

	private selectButton(index: number): void {
		const currentButton = this.buttons[this.selectedButtonIndex];
		currentButton.setTint(0xffffff);

		const button = this.buttons[index];
		button.setTint(0x66ff7f);

		this.buttonSelector.x = button.x + button.displayWidth * 0.5;
		this.buttonSelector.y = button.y + 10;

		this.selectedButtonIndex = index;
	}

	private selectNextButton(change: number = 1): void {
		let index = this.selectedButtonIndex + change;

		if (index >= this.buttons.length) {
			index = 0;
		} else if (index < 0) {
			index = this.buttons.length - 1;
		}

		this.selectButton(index);
	}

	private confirmSelection(): void {
		const button = this.buttons[this.selectedButtonIndex];

		button.emit(Keys.Events.Selected);
	}

	private startGame(): void {
		if (!this.startingScene) {
			this.startingScene = true;
			this.music.stop();
			this.scene.start(Keys.Scenes.Game);
		}
	}

	private exitGame(): void {
		this.game.destroy(true, true);
	}
}
