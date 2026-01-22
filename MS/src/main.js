import dotenv from 'dotenv';
import { receiveMessages, deleteMessage, sendProcessedMessage } from './sqs.js';

dotenv.config();

console.log('Starting Orders Processor Microservice...');

async function processOrderMessage(message) {
  try {
    const body = JSON.parse(message.Body);
    const { userId, orderId } = body;

    console.log(`Processing order ${orderId} for user ${userId}`);

    await sendProcessedMessage(orderId);

    await deleteMessage(message.ReceiptHandle);

    console.log(`Order ${orderId} processed successfully\n`);
  } catch (error) {
    console.error('Error processing message:', error);
    console.error('Message body:', message.Body);
  }
}

async function pollMessages() {
  console.log('Polling for messages...\n');

  while (true) {
    try {
      const messages = await receiveMessages();

      if (messages.length > 0) {
        console.log(`Received ${messages.length} message(s)`);

        for (const message of messages) {
          await processOrderMessage(message);
        }
      }
    } catch (error) {
      console.error('Error in polling loop:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

pollMessages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
