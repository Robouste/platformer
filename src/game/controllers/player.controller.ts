import { SoundManager, SpriteWithDynamicBody } from "../helpers/types";
import { IdleState } from "../states/movements/idle.state";
import { JumpState } from "../states/movements/jump.state";
import { MoveLeftState } from "../states/movements/move-left.state";
import { MoveRightState } from "../states/movements/move-right.state";
import { IMovementState } from "../states/movements/movement.state";

declare type MovementState = "idle" | "left" | "right" | "jump";

export class Playercontroller {
	private states: Map<MovementState, IMovementState> = new Map();
	private currentState: { enter: () => void };

	constructor(player: SpriteWithDynamicBody, sound: SoundManager) {
		this.states.set("idle", new IdleState(player, sound));
		this.states.set("left", new MoveLeftState(player, sound));
		this.states.set("right", new MoveRightState(player, sound));
		this.states.set("jump", new JumpState(player, sound));
	}

	/**
	 *
	 * @param name Name of the movement
	 * @param force Force the state to be triggered. By default, the state won't be triggered if it hasn't changed
	 * @returns
	 */
	public setState(name: MovementState, force?: boolean): void {
		if (this.currentState === this.states.get(name) && !force) {
			return;
		}

		this.currentState = this.states.get(name);
		this.currentState.enter();
	}
}
