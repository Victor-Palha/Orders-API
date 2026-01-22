import dotenv from 'dotenv';
import { createDatabasePool, saveTransaction, updateOrderStatus, closeDatabasePool } from './database.js';
import { receiveMessages, deleteMessage, sendProcessedMessage } from './sqs.js';

dotenv.config();

console.log('🚀 Starting Orders Processor Microservice...');

// Initialize database connection
createDatabasePool();

// Process a single order message
async function processOrderMessage(message) {
  try {
    const body = JSON.parse(message.Body);
    const { userId, orderId, createdAt, totalAmount } = body;

    console.log(`📦 Processing order ${orderId} for user ${userId}`);

    // Save transaction to database
    await saveTransaction(userId, orderId, createdAt, totalAmount);

    // Update order status to PROCESSED
    await updateOrderStatus(orderId, 'PROCESSED');

    // Send message to output queue
    await sendProcessedMessage(orderId);

    // Delete message from input queue
    await deleteMessage(message.ReceiptHandle);

    console.log(`✅ Order ${orderId} processed successfully\n`);
  } catch (error) {
    console.error('❌ Error processing message:', error);
    console.error('Message body:', message.Body);
  }
}

// Main polling loop
async function pollMessages() {
  console.log('👂 Polling for messages...\n');

  while (true) {
    try {
      const messages = await receiveMessages();

      if (messages.length > 0) {
        console.log(`📬 Received ${messages.length} message(s)`);

        for (const message of messages) {
          await processOrderMessage(message);
        }
      }
    } catch (error) {
      console.error('❌ Error in polling loop:', error);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
    }
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await closeDatabasePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await closeDatabasePool();
  process.exit(0);
});

// Start the service
pollMessages().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
