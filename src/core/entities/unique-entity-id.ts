export abstract class UniqueEntityID<T = string | number> {
	protected value: T;

	public toValue() {
		return this.value;
	}

	public constructor(value?: T) {
		this.value = value;
	}

	public equals(id: UniqueEntityID<T>): boolean {
		return this.value === id.value;
	}
}
