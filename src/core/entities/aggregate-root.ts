import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { EntityBase } from "./entity-base";
import { UniqueEntityID } from "./unique-entity-id";

export abstract class AggregateRoot<
	PROPS,
	ID extends UniqueEntityID<string | number>,
> extends EntityBase<PROPS, ID> {
	private _domainEvents: DomainEvent<ID>[] = [];

	get domainEvents(): DomainEvent<ID>[] {
		return this._domainEvents;
	}

	protected addDomainEvent(domainEvent: DomainEvent<ID>): void {
		this._domainEvents.push(domainEvent);
		DomainEvents.markAggregateForDispatch(this);
	}

	public clearEvents(): void {
		this._domainEvents = [];
	}
}
