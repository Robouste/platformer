import { Keys } from "../../helpers/keys";
import { MovementState } from "./movement.state";

export class MoveLeftState extends MovementState {
	public enter(): void {
		if (this.player.body.onFloor()) {
			this.player.play(Keys.Animations.Walk);
		}

		this.player.flipX = true;
		this.player.setVelocityX(-200);
	}
}
