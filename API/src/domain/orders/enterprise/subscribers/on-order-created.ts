import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { Injectable } from "@nestjs/common";
import { OrderCreatedEvent } from "../events/order-created-event";
import { QueueService } from "../../application/queue/queue-service";

@Injectable()
export class OnOrderCreated implements EventHandler {
    private broker: QueueService;

    constructor(broker: QueueService) {
        this.broker = broker;
        this.setupSubscriptions();
    }

    public setupSubscriptions(): void {
        DomainEvents.register(this.handleOrderCreated.bind(this), OrderCreatedEvent.name)
    }

    private async handleOrderCreated({ order }: OrderCreatedEvent): Promise<void> {
        console.log(`Handling OrderCreatedEvent for order ID: ${order.id.toString()}`);
        await this.broker.sendOrderMessage(order);
    }
}