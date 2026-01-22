import { OnOrderCreated } from "@/domain/orders/enterprise/subscribers/on-order-created";
import { Module } from "@nestjs/common";
import { SqsModule } from "../configs/sqs/sqs.module";

@Module({
    imports: [SqsModule],
    providers: [OnOrderCreated],
})
export class EventsModule { }