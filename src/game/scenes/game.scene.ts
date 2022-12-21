import { BaseScene } from "../base.scene";
import { Playercontroller } from "../controllers/player.controller";
import { Keys } from "../helpers/keys";
import { ArcadeSprite, CursorKeys, GameText, SpriteWithDynamicBody, Tile, Tilemap, TilemapLayer } from "../helpers/types";

export class GameScene extends BaseScene {
	private map: Tilemap;
	private groundLayer: TilemapLayer;
	private coinLayer: TilemapLayer;
	private player: SpriteWithDynamicBody;
	private attack: SpriteWithDynamicBody;
	private cursors: CursorKeys;
	private score: number = 0;
	private text: GameText;
	private lastAttackTime: number = 0;
	private isAttacking: boolean = false;
	private wasBodyInTheAir: boolean = false;
	private baseAttackSpeed: number = 800;
	private attackSpeedMultiplier: number = 1;
	private playerController: Playercontroller;

	private get isJumpKeyPressed(): boolean {
		return this.cursors.up.isDown;
	}

	private get attackSpeed(): number {
		return this.baseAttackSpeed * this.attackSpeedMultiplier;
	}

	constructor() {
		super(Keys.Scenes.Game);
	}

	public create(): void {
		super.create();

		this.createWorld();
		this.createPlayer();
		this.createAttack();
		this.createCoins();
		this.createCamera();
		this.createAnims();
		this.createScore();

		this.physics.add.collider(this.groundLayer, this.player);

		this.cursors = this.input.keyboard.createCursorKeys();
		const music = this.game.sound.add(Keys.Musics.Level1, { loop: true, volume: 0.3 });

		music.play();

		this.playerController = new Playercontroller(this.player, this.sound);
		this.playerController.setState("idle");
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);
		this.handleInputs(time);

		if (this.isAttacking) {
			this.stickAttackToPlayer();
		}

		if (this.player.body.onFloor() && this.wasBodyInTheAir) {
			this.sound.play(Keys.Sfx.Land);
			this.playerController.setState("idle", true);
		}

		this.wasBodyInTheAir = !this.player.body.onFloor();
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
		this.player.setOrigin(0, 1);
		this.player.setBounce(0);
		this.player.setCollideWorldBounds(true); // Don't go out of the map
		// this.player.body.setSize(this.player.width, this.player.height - 8);
	}

	private createAttack(): void {
		this.attack = this.physics.add.sprite(0, 0, Keys.Atlases.Attack).setScale(0.2).disableBody().setAlpha(0).setOrigin(0, 0.5);
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
			frames: this.anims.generateFrameNames(Keys.Atlases.P_Run, { prefix: "player_", start: 1, end: 8, zeroPad: 2, suffix: ".png" }),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: Keys.Animations.Idle,
			frames: [{ key: Keys.Atlases.Player, frame: "idle" }],
			frameRate: 10,
		});

		this.anims.create({
			key: Keys.Animations.Jump,
			frames: [{ key: Keys.Atlases.Player, frame: "jump" }],
			frameRate: 10,
		});

		this.anims.create({
			key: Keys.Animations.Attack,
			frames: this.anims.generateFrameNames(Keys.Atlases.Attack, { prefix: "attack_", start: 1, end: 4, zeroPad: 2, suffix: ".png" }),
			frameRate: 24,
			repeat: 0,
		});

		this.anims.create({
			key: Keys.Animations.PlayerAttack,
			frames: this.anims.generateFrameNames(Keys.Atlases.P_Attack, {
				prefix: "p_attack_",
				start: 1,
				end: 4,
				zeroPad: 2,
				suffix: ".png",
			}),
			frameRate: 24,
			repeat: 0,
		});
	}

	private createScore(): void {
		this.text = this.add.text(+this.game.config.width - 20, 20, "0", { fontSize: "20px", color: "#fff" }).setOrigin(1, 0);
		this.text.setScrollFactor(0);
	}

	private handleInputs(time: number): void {
		if (this.cursors.left.isDown) {
			this.playerController.setState("left");
		} else if (this.cursors.right.isDown) {
			this.playerController.setState("right");
		}

		if (this.isJumpKeyPressed && this.player.body.onFloor()) {
			this.playerController.setState("jump");
		}

		if (
			this.cursors.left.isUp &&
			this.cursors.right.isUp &&
			this.player.body.onFloor() &&
			!this.isJumpKeyPressed &&
			!this.isAttacking
		) {
			this.playerController.setState("idle");
		}

		if (this.cursors.space.isDown && time - this.lastAttackTime > this.attackSpeed) {
			this.isAttacking = true;
			this.stickAttackToPlayer();
			this.sound.play(Keys.Sfx.Attack);
			this.attack.setAlpha(1);
			this.attack.anims.play(Keys.Animations.Attack, true).once("animationcomplete", () => this.attack.setAlpha(0));
			this.player.anims.play(Keys.Animations.PlayerAttack, true).once("animationcomplete", () => {
				if (this.player.body.onFloor()) {
					this.playerController.setState("idle", true);
				} else {
					this.player.anims.play(Keys.Animations.Jump);
				}
				this.isAttacking = false;
			});

			this.lastAttackTime = time;
		}
	}

	private collectCoins(sprite: ArcadeSprite, tile: Tile): boolean {
		this.coinLayer.removeTileAt(tile.x, tile.y);
		this.score++;
		this.text.setText(this.score.toString());
		this.sound.play(Keys.Sfx.Collect, {
			volume: 1,
		});

		if (this.score % 5 === 0) {
			this.attackSpeedMultiplier -= 0.2;
		}

		return false;
	}

	private stickAttackToPlayer(): void {
		this.attack.flipX = this.player.flipX;
		const x = this.player.body.position.x + this.player.body.width / 2;
		const y = this.player.body.position.y + this.player.body.height / 2;

		if (this.attack.flipX) {
			this.attack.setOrigin(1, 0.5);
		} else {
			this.attack.setOrigin(0, 0.5);
		}

		this.attack.setPosition(x, y);
	}
}
