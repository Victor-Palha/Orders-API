import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, SendMessageCommand } from '@aws-sdk/client-sqs';
import dotenv from 'dotenv';

dotenv.config();

const clientConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};

// Add endpoint for LocalStack
if (process.env.AWS_ENDPOINT_URL) {
  clientConfig.endpoint = process.env.AWS_ENDPOINT_URL;
}

const sqsClient = new SQSClient(clientConfig);

export async function receiveMessages() {
  const command = new ReceiveMessageCommand({
    QueueUrl: process.env.SQS_INPUT_QUEUE_URL,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 20,
    VisibilityTimeout: 30
  });

  try {
    const response = await sqsClient.send(command);
    return response.Messages || [];
  } catch (error) {
    console.error('❌ Error receiving messages from SQS:', error);
    return [];
  }
}

export async function deleteMessage(receiptHandle) {
  const command = new DeleteMessageCommand({
    QueueUrl: process.env.SQS_INPUT_QUEUE_URL,
    ReceiptHandle: receiptHandle
  });

  try {
    await sqsClient.send(command);
    console.log('✅ Message deleted from queue');
  } catch (error) {
    console.error('❌ Error deleting message from SQS:', error);
    throw error;
  }
}

export async function sendProcessedMessage(orderId) {
  const command = new SendMessageCommand({
    QueueUrl: process.env.SQS_OUTPUT_QUEUE_URL,
    MessageBody: JSON.stringify({
      orderId,
      processedAt: new Date().toISOString(),
      status: 'PROCESSED'
    })
  });

  try {
    await sqsClient.send(command);
    console.log(`✅ Processed message sent to output queue for order ${orderId}`);
  } catch (error) {
    console.error(`❌ Error sending message to output queue for order ${orderId}:`, error);
    throw error;
  }
}
