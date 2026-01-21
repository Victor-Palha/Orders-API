import { UniqueEntityID } from "./unique-entity-id";

export abstract class EntityBase<T> {
	private _id: UniqueEntityID;
	protected _props: T;

	protected constructor(props: T, id: UniqueEntityID) {
		this._id = id;
		this._props = props;
	}

	public get id(): UniqueEntityID {
		return this._id;
	}

	public get props(): T {
		return this._props;
	}

	public equals(entity: EntityBase<any>): boolean {
		if (entity === this) {
			return true;
		}

		return false;
	}
}
