#!/bin/bash

echo "Creating SQS queues..."

# Create orders-input queue
awslocal sqs create-queue --queue-name orders-input

# Create orders-output queue
awslocal sqs create-queue --queue-name orders-output

echo "SQS queues created successfully!"
echo "Input Queue: http://localstack:4566/000000000000/orders-input"
echo "Output Queue: http://localstack:4566/000000000000/orders-output"
