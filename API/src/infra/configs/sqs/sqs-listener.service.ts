import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { EnvService } from "../env/env.service";
import { UpdateOrderStatusUseCase } from "@/domain/orders/application/use-cases/update-order-status-use-case";

@Injectable()
export class SqsListenerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(SqsListenerService.name);
    private sqsClient: SQSClient;
    private isRunning = false;
    private pollingInterval: NodeJS.Timeout | null = null;

    constructor(
        private envService: EnvService,
        private updateOrderStatusUseCase: UpdateOrderStatusUseCase
    ) {
        const clientConfig = {
            region: this.envService.get("AWS_REGION"),
            credentials: {
                accessKeyId: this.envService.get("AWS_ACCESS_KEY_ID"),
                secretAccessKey: this.envService.get("AWS_SECRET_ACCESS_KEY"),
            },
        };

        const endpointUrl = this.envService.get("AWS_ENDPOINT_URL");
        if (endpointUrl) {
            clientConfig["endpoint"] = endpointUrl;
        }

        this.sqsClient = new SQSClient(clientConfig);
    }

    async onModuleInit() {
        this.logger.log("Starting SQS Listener Service...");
        this.isRunning = true;
        this.startPolling();
    }

    async onModuleDestroy() {
        this.logger.log("Stopping SQS Listener Service...");
        this.isRunning = false;
        if (this.pollingInterval) {
            clearTimeout(this.pollingInterval);
        }
    }

    private startPolling() {
        if (!this.isRunning) return;

        this.pollMessages().finally(() => {
            if (this.isRunning) {
                this.pollingInterval = setTimeout(() => this.startPolling(), 5000);
            }
        });
    }

    private async pollMessages() {
        const command = new ReceiveMessageCommand({
            QueueUrl: this.envService.get("SQS_ORDERS_OUTPUT_QUEUE_URL"),
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 20,
            VisibilityTimeout: 30,
        });

        try {
            const response = await this.sqsClient.send(command);
            const messages = response.Messages || [];

            if (messages.length > 0) {
                this.logger.log(`Received ${messages.length} message(s) from output queue`);
            }

            for (const message of messages) {
                await this.processMessage(message);
            }
        } catch (error) {
            this.logger.error("Error polling SQS:", error);
        }
    }

    private async processMessage(message: any) {
        try {
            const body = JSON.parse(message.Body);
            this.logger.log(`Processing message for order ${body.orderId}`);

            const result = await this.updateOrderStatusUseCase.execute({
                orderId: body.orderId,
                status: body.status,
                processedAt: body.processedAt,
            });

            if (result.success()) {
                this.logger.log(`Order ${body.orderId} status updated to ${body.status}`);
                await this.deleteMessage(message.ReceiptHandle);
            } else {
                this.logger.error(`Failed to update order ${body.orderId}:`, result.value);
            }
        } catch (error) {
            this.logger.error("Error processing message:", error);
        }
    }

    private async deleteMessage(receiptHandle: string) {
        const command = new DeleteMessageCommand({
            QueueUrl: this.envService.get("SQS_ORDERS_OUTPUT_QUEUE_URL"),
            ReceiptHandle: receiptHandle,
        });

        try {
            await this.sqsClient.send(command);
            this.logger.log("Message deleted from queue");
        } catch (error) {
            this.logger.error("Error deleting message:", error);
        }
    }
}
