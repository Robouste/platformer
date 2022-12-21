import { Keys } from "../../helpers/keys";
import { MovementState } from "./movement.state";

export class JumpState extends MovementState {
	public enter(): void {
		this.player.setVelocityY(-500);
		this.player.play(Keys.Animations.Jump);
		this.sound.play(Keys.Sfx.Jump);
	}
}
