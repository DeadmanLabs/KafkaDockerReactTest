import React, { useState, useEffect, useCallback } from 'react';
import useKafka from '../KafkaUtil/useKafka.tsx';

interface MessageData {
    topic: string;
    message: string;
}

const Messager = () => {
    const { kafkaSocket, connected } = useKafka();
    const [messages, setMessages] = useState<MessageData[]>([]);

    const handleMessage = useCallback((data: MessageData) => {
        console.log('Received message:', data);
        setMessages((prevMessages) => [...prevMessages, data]);
    }, []);

    useEffect(() => {
        if (!kafkaSocket) return;

        kafkaSocket.on('message', handleMessage);
        kafkaSocket.onAny((event, ...args) => {
            console.log(`${event} => ${args}`);
        });

        return () => {
            kafkaSocket.off('message', handleMessage);
        };
        
    }, [kafkaSocket, handleMessage]);

    return (
        <div>
            <h2>Kafka Connection Status: {connected ? 'Connected!' : 'Disconnected'}</h2>
            <div>
                <h3>Received Messages:</h3>
                <ul>
                    [
                    {messages.map((msg, index) => (
                        <li key={index}>
                            <strong>{msg.topic}:</strong> {msg.message}
                        </li>
                    ))}
                    ]
                </ul>
            </div>
        </div>
    )
};

export default Messager;