import { Keys } from "../helpers/keys";
import { ArcadeSprite, CursorKeys, GameText, SpriteWithDynamicBody, Tile, Tilemap, TilemapLayer } from "../helpers/types";

export class GameScene extends Phaser.Scene {
	private map: Tilemap;
	private groundLayer: TilemapLayer;
	private coinLayer: TilemapLayer;
	private player: SpriteWithDynamicBody;
	private cursors: CursorKeys;
	private score: number = 0;
	private text: GameText;

	private get isJumpKeyPressed(): boolean {
		return this.cursors.up.isDown;
	}

	constructor() {
		super(Keys.Scenes.Game);
	}

	public create(): void {
		this.createWorld();
		this.createPlayer();
		this.createCoins();
		this.createCamera();
		this.createAnims();
		this.createScore();

		this.physics.add.collider(this.groundLayer, this.player);

		this.cursors = this.input.keyboard.createCursorKeys();
	}

	public update(): void {
		this.handleInputs();
	}

	private createWorld(): void {
		this.map = this.make.tilemap({ key: Keys.Tiles.Map });

		const groundTiles = this.map.addTilesetImage(Keys.Sprites.Tiles);
		this.groundLayer = this.map.createLayer(Keys.Layers.World, groundTiles, 0, 0);
		this.groundLayer.setCollisionByExclusion([-1]);

		this.physics.world.bounds.width = this.groundLayer.width;
		this.physics.world.bounds.height = this.groundLayer.height;
	}

	private createPlayer(): void {
		this.player = this.physics.add.sprite(200, 200, Keys.Atlases.Player);
		this.player.setBounce(0.2); // Player will bounce again obsticles
		this.player.setCollideWorldBounds(true); // Don't go out of the map
		this.player.body.setSize(this.player.width, this.player.height - 8);
	}

	private createCoins(): void {
		const coinTiles = this.map.addTilesetImage(Keys.Images.Coin);
		this.coinLayer = this.map.createLayer(Keys.Layers.Coins, coinTiles, 0, 0);

		this.coinLayer.setTileIndexCallback(17, this.collectCoins, this);
		this.physics.add.overlap(this.player, this.coinLayer);
	}

	private createCamera(): void {
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBackgroundColor("#ccf");
	}

	private createAnims(): void {
		this.anims.create({
			key: Keys.Animations.Walk,
			frames: this.anims.generateFrameNames(Keys.Atlases.Player, { prefix: "p1_walk", start: 1, end: 11, zeroPad: 2 }),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: Keys.Animations.Idle,
			frames: [{ key: Keys.Atlases.Player, frame: "p1_stand" }],
			frameRate: 10,
		});

		this.anims.create({
			key: Keys.Animations.Jump,
			frames: [{ key: Keys.Atlases.Player, frame: "p1_jump" }],
			frameRate: 10,
		});
	}

	private createScore(): void {
		this.text = this.add.text(+this.game.config.width - 20, 20, "0", { fontSize: "20px", color: "#fff" }).setOrigin(1, 0);
		this.text.setScrollFactor(0);
	}

	private handleInputs(): void {
		if (this.cursors.left.isDown) {
			this.player.body.setVelocityX(-200);

			this.player.anims.play(Keys.Animations.Walk, true);

			this.player.flipX = true;
		} else if (this.cursors.right.isDown) {
			this.player.body.setVelocityX(200);

			this.player.anims.play(Keys.Animations.Walk, true);

			this.player.flipX = false;
		}

		if (this.isJumpKeyPressed && this.player.body.onFloor()) {
			this.player.body.setVelocityY(-500);
			this.player.anims.play(Keys.Animations.Jump, true);
		}

		if (this.cursors.left.isUp && this.cursors.right.isUp && this.player.body.onFloor() && !this.isJumpKeyPressed) {
			this.player.setVelocityX(0);
			this.player.anims.play(Keys.Animations.Idle, true);
		}
	}

	private collectCoins(sprite: ArcadeSprite, tile: Tile): boolean {
		this.coinLayer.removeTileAt(tile.x, tile.y);
		this.score++;
		this.text.setText(this.score.toString());
		return false;
	}
}
