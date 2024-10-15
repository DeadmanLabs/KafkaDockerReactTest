const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'reader-' + Math.random().toString(36).substring(7),
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  retry: {
    initialRetryTime: 1000,
    retries: 30,
  },
  logLevel: logLevel.ERROR, // Set log level to ERROR
});

const consumer = kafka.consumer({ groupId: 'reader-group-' + Math.random().toString(36).substring(7) });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);
    },
  });
};

run().catch(e => {
  console.error(`[reader] ${e.message}`, e);
  process.exit(1);
});
