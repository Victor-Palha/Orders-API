import { Module } from "@nestjs/common";
import { SqsService } from "./sqs.service";
import { SqsListenerService } from "./sqs-listener.service";
import { EnvModule } from "../env/env.module";
import { QueueService } from "@/domain/orders/application/queue/queue-service";
import { UpdateOrderStatusUseCase } from "@/domain/orders/application/use-cases/update-order-status-use-case";
import { DatabaseModule } from "@/infra/database/database.module";

@Module({
    imports: [EnvModule, DatabaseModule],
    providers: [
        {
            provide: QueueService,
            useClass: SqsService,
        },
        UpdateOrderStatusUseCase,
        SqsListenerService,
    ],
    exports: [QueueService],
})
export class SqsModule { }
