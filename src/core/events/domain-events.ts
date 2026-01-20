import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";

type DomainEventCallback = (event: any) => void;

export class DomainEvents {
	private static handlersMap: Record<string, DomainEventCallback[]> = {};
	private static markedAggregates: AggregateRoot<unknown, UniqueEntityID<string | number>>[] = [];

	public static markAggregateForDispatch<PROPS, ID extends UniqueEntityID<string | number>>(
		aggregate: AggregateRoot<PROPS, ID>
	) {
		const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

		if (!aggregateFound) {
			this.markedAggregates.push(aggregate);
		}
	}

	private static dispatchAggregateEvents<PROPS, ID extends UniqueEntityID<string | number>>(
		aggregate: AggregateRoot<PROPS, ID>
	) {
		aggregate.domainEvents.forEach((event: DomainEvent<ID>) => this.dispatch(event));
	}

	private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<any, any>) {
		const index = this.markedAggregates.findIndex(a => a.equals(aggregate));

		this.markedAggregates.splice(index, 1);
	}

	private static findMarkedAggregateByID(
		id: UniqueEntityID<string | number>
	): AggregateRoot<any, UniqueEntityID<string | number>> | undefined {
		return this.markedAggregates.find(aggregate => aggregate.id.equals(id));
	}

	public static dispatchEventsForAggregate(id: UniqueEntityID<string | number>) {
		const aggregate = this.findMarkedAggregateByID(id);

		if (aggregate) {
			this.dispatchAggregateEvents(aggregate);
			aggregate.clearEvents();
			this.removeAggregateFromMarkedDispatchList(aggregate);
		}
	}

	public static register(callback: DomainEventCallback, eventClassName: string) {
		const wasEventRegisteredBefore = eventClassName in this.handlersMap;

		if (!wasEventRegisteredBefore) {
			this.handlersMap[eventClassName] = [];
		}

		this.handlersMap[eventClassName].push(callback);
	}

	public static clearHandlers() {
		this.handlersMap = {};
	}

	public static clearMarkedAggregates() {
		this.markedAggregates = [];
	}

	private static dispatch<ID>(event: DomainEvent<ID>) {
		const eventClassName: string = event.constructor.name;

		const isEventRegistered = eventClassName in this.handlersMap;

		if (isEventRegistered) {
			const handlers = this.handlersMap[eventClassName];

			for (const handler of handlers) {
				handler(event);
			}
		}
	}
}
