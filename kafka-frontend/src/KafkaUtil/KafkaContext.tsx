import React from 'react';
import { Socket } from 'socket.io-client';

export interface KafkaContextProps {
    kafkaSocket: Socket | null;
    connected: boolean;
}

const KafkaContext = React.createContext<KafkaContextProps | undefined>(undefined);

export default KafkaContext;