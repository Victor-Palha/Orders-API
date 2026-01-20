export abstract class EntityBase<T, ID> {
	private _id: ID;
	protected _props: T;

	protected constructor(props: T, id: ID) {
		this._id = id;
		this._props = props;
	}

	public get id(): ID {
		return this._id;
	}

	public get props(): T {
		return this._props;
	}

	public equals(entity: EntityBase<any, any>): boolean {
		if (entity === this) {
			return true;
		}

		return false;
	}
}
