import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import KafkaContext, { KafkaContextProps } from './KafkaContext.tsx';

interface KafkaProviderProps {
    children: React.ReactNode;
}

const KafkaProvider: React.FC<KafkaProviderProps> = ({ children }) => {
    const [kafkaSocket, setKafkaSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        const socket = io('http://localhost:8080');
        setKafkaSocket(socket);
        socket.on('connect', () => {
            console.log('Connected to Kafka middleware server');
            setConnected(true);
        });
        socket.on('disconnect', (reason: string) => {
            console.log('Disconnected from Kafka middleware server:', reason);
            setConnected(false);
        });
        socket.on('connect_error', (err: Error) => {
            console.error('Connection error:', err);
            setConnected(false);
        });
        return () => {
            socket.disconnect();
        }
    }, []);

    return (
        <KafkaContext.Provider value={{ kafkaSocket, connected }}>
            {children}
        </KafkaContext.Provider>
    );
};

export default KafkaProvider;