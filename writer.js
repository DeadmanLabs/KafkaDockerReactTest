const { Kafka, logLevel } = require('kafkajs');
const readline = require('readline');

const kafka = new Kafka({
  clientId: 'writer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  retry: {
    initialRetryTime: 1000,
    retries: 30,
  },
  logLevel: logLevel.ERROR, // Set log level to ERROR
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Enter messages to send to Kafka (Ctrl+C to exit):');

  rl.on('line', async (input) => {
    try {
      await producer.send({
        topic: 'test-topic',
        messages: [
          { value: input },
        ],
      });
      console.log(`Sent message: ${input}`);
    } catch (e) {
      console.error(`[writer] Error sending message: ${e.message}`, e);
    }
  });
};

run().catch(e => {
  console.error(`[writer] ${e.message}`, e);
  process.exit(1);
});
