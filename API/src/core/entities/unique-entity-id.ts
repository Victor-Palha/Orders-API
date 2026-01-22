import { randomUUID } from "node:crypto";

export class UniqueEntityID {
	protected value: string;

	public toValue() {
		return this.value;
	}

	public constructor(value?: string) {
		this.value = value ?? randomUUID();
	}

	public equals(id: UniqueEntityID): boolean {
		return this.value === id.value;
	}
}
