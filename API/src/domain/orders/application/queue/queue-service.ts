import type { OrderEntity } from "../../enterprise/order-entity";

export abstract class QueueService {
	abstract sendOrderMessage(order: OrderEntity): Promise<void>;
}
