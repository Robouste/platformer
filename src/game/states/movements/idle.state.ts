import { Keys } from "../../helpers/keys";
import { MovementState } from "./movement.state";

export class IdleState extends MovementState {
	public enter(): void {
		this.player.setVelocity(0);
		this.player.play(Keys.Animations.Idle);
	}
}
