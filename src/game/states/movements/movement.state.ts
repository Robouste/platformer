import { SoundManager, SpriteWithDynamicBody } from "../../helpers/types";

export interface IMovementState {
	enter: () => void;
}

export abstract class MovementState implements IMovementState {
	constructor(protected player: SpriteWithDynamicBody, protected sound: SoundManager) {}

	public abstract enter(): void;
}
