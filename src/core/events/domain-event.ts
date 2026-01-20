export interface DomainEvent<ID> {
	occurredAt: Date;
	getAggregateId(): ID;
}
