import { Keys } from "./keys";
import { CursorKeys, SpriteWithDynamicBody } from "./types";

export class BasicMovements {
	public static handle(keys: CursorKeys, player: SpriteWithDynamicBody, walkAnimKey: Keys.Animations): void {
		if (keys.left.isDown) {
			player.body.setVelocityX(-200);

			if (player.body.onFloor()) {
				player.anims.play(walkAnimKey, true);
			}

			player.flipX = true;
		} else if (keys.right.isDown) {
			player.body.setVelocityX(200);

			if (player.body.onFloor()) {
				player.anims.play(walkAnimKey, true);
			}

			player.flipX = false;
		}
	}
}
