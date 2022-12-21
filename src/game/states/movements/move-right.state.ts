import { Keys } from "../../helpers/keys";
import { MovementState } from "./movement.state";

export class MoveRightState extends MovementState {
	public enter(): void {
		if (this.player.body.onFloor()) {
			this.player.play(Keys.Animations.Walk);
		}

		this.player.flipX = false;
		this.player.setVelocityX(200);
	}
}
