import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { EntityBase } from "./entity-base";
import { UniqueEntityID } from "./unique-entity-id";

export abstract class AggregateRoot<PROPS> extends EntityBase<PROPS> {
	private _domainEvents: DomainEvent<UniqueEntityID>[] = [];
	get domainEvents(): DomainEvent<UniqueEntityID>[] {
		return this._domainEvents;
	}

	protected addDomainEvent(domainEvent: DomainEvent<UniqueEntityID>): void {
		this._domainEvents.push(domainEvent);
		DomainEvents.markAggregateForDispatch(this);
	}

	public clearEvents(): void {
		this._domainEvents = [];
	}
}
