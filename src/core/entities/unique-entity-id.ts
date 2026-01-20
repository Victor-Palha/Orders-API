export class UniqueEntityID {
	protected value: string;

	public toValue() {
		return this.value;
	}

	public constructor(value?: string) {
		this.value = value;
	}

	public equals(id: UniqueEntityID): boolean {
		return this.value === id.value;
	}
}
