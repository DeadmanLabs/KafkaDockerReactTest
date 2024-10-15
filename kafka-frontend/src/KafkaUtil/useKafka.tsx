import { useContext } from 'react';
import KafkaContext, { KafkaContextProps } from './KafkaContext.tsx';

interface UseKafkaReturn {
    kafkaSocket: KafkaContextProps['kafkaSocket'],
    connected: KafkaContextProps['connected']
}

const useKafka = (): UseKafkaReturn => {
    const context = useContext(KafkaContext);

    if (!context) {
        throw new Error('useKafka must be used within a KafkaProvider');
    }

    return {
        kafkaSocket: context.kafkaSocket,
        connected: context.connected
    };
};

export default useKafka;