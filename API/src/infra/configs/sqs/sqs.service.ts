import { Injectable } from "@nestjs/common";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { EnvService } from "../env/env.service";
import { OrderEntity } from "@/domain/orders/enterprise/order-entity";
import { QueueService } from "@/domain/orders/application/queue/queue-service";

@Injectable()
export class SqsService implements QueueService {
    private sqsClient: SQSClient;

    constructor(private envService: EnvService) {
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

    async sendOrderMessage(order: OrderEntity): Promise<void> {
        const messageBody = {
            userId: order.props.userId.toString(),
            orderId: order.id.toValue(),
            createdAt: order.props.createdAt.toISOString(),
            totalAmount: order.props.totalAmount,
        };
        console.log("Sending order message to SQS:", messageBody);
        const command = new SendMessageCommand({
            QueueUrl: this.envService.get("SQS_ORDERS_QUEUE_URL"),
            MessageBody: JSON.stringify(messageBody),
        });

        try {
            await this.sqsClient.send(command);
            console.log(`Order ${order.id.toValue()} sent to SQS queue`);
        } catch (error) {
            console.error("Error sending message to SQS:", error);
            throw error;
        }
    }
}
