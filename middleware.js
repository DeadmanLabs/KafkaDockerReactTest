const http = require('http');
const socketIO = require('socket.io');
const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');

const server = http.createServer();

const io = socketIO(server, {
    cors: {
        origin: '*'
    }
});
const originalIoEmit = io.emit;
io.emit = function(event, ...args) {
    console.log(`Emitting event: ${event}`, args);
    originalIoEmit.call(this, event, ...args);
}

const kafka = new Kafka({
    clientId: 'middleware-' + uuidv4(),
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'middleware-group-' + uuidv4() });

const topics = ['test-topic'];

const run = async () => {
    await consumer.connect();
    for (const topic of topics) {
        await consumer.subscribe({ topic, fromBeginning: false });
    }
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received ${topic} message => ${message.value.toString()}`);
            console.log(`Sending message...`);
            io.emit('message', { 
                topic, 
                message: message.value.toString()
            });
            console.log(`Message Sent!`);
        }
    });
};

run().catch(console.error);

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    const originalSocketEmit = socket.emit;
    socket.emit = function(event, ...args) {
        console.log(`Socket ${socket.id} emitting event: ${event}`, args);
        originalSocketEmit.call(this, event, ...args);
    };
    socket.on('client-message', async (data) => {
        console.log(`Received message from client ${socket.id}`, data);
    });
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Middleware server is running on port ${PORT}`);
});