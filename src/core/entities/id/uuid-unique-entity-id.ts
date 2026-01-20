import { randomUUID } from "node:crypto";
import { UniqueEntityID } from "../unique-entity-id";

export class UUIDUniqueEntityId extends UniqueEntityID<string> {
	constructor(value?: string) {
		super(value ?? randomUUID());
	}
}
