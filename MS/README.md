# Orders Processor Microservice

Node.js microservice that processes orders from AWS SQS and saves transactions to MySQL.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
# Edit .env with your database and AWS credentials
```

3. Create the transactions table:

```bash
mysql -u orders_user -p orders_db < migrations/create_transactions_table.sql
```

## Running

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Flow

1. Receives messages from SQS input queue
2. Parses message containing: `userId`, `orderId`, `createdAt`, `totalAmount`
3. Saves transaction to MySQL `transactions` table
4. Updates order status to `PROCESSED`
5. Sends message to SQS output queue with `orderId`
6. Deletes processed message from input queue

## Environment Variables

- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port
- `DB_USER` - MySQL user
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - MySQL database name
- `AWS_REGION` - AWS region
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `SQS_INPUT_QUEUE_URL` - Input queue URL
- `SQS_OUTPUT_QUEUE_URL` - Output queue URL
