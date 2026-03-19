import { Kafka, Producer, Partitioners } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'prototype-next-app',
  brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

// Producer 인스턴스 (싱글톤 패턴)
let producer: Producer | null = null;

/**
 * Kafka Producer 인스턴스 가져오기
 */
export const getKafkaProducer = async (): Promise<Producer> => {
  if (!producer) {
    producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    await producer.connect();
    console.log('Kafka producer connected');
  }
  return producer;
};

/**
 * 메시지 전송 (Producer)
 * @param topic 토픽 이름
 * @param messages 메시지 배열
 */
export const sendKafkaMessage = async (
  topic: string,
  messages: Array<{ key?: string; value: string; headers?: Record<string, string> }>
) => {
  try {
    const producer = await getKafkaProducer();
    console.log(`[Kafka] Sending message to topic: ${topic}`, {
      messageCount: messages.length,
      firstMessageKey: messages[0]?.key,
      firstMessagePreview: messages[0]?.value?.substring(0, 100),
    });
    
    const result = await producer.send({
      topic,
      messages,
    });
    
    console.log(`[Kafka] Message sent successfully to topic: ${topic}`, {
      topic: result[0]?.topicName,
      partition: result[0]?.partition,
      offset: result[0]?.offset,
    });
    
    return result;
  } catch (error) {
    console.error('[Kafka] Error sending Kafka message:', error);
    if (error instanceof Error) {
      console.error('[Kafka] Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
};

/**
 * 연결 종료
 */
export const disconnectKafka = async () => {
  if (producer) {
    await producer.disconnect();
    producer = null;
    console.log('Kafka producer disconnected');
  }
};

// 프로세스 종료 시 정리 (한 번만 등록)
type GlobalWithKafka = typeof globalThis & {
  __kafkaListenersRegistered?: boolean;
};

const globalForKafka = globalThis as GlobalWithKafka;

if (typeof process !== 'undefined' && !globalForKafka.__kafkaListenersRegistered) {
  const handleShutdown = async (signal: string) => {
    console.log(`[Kafka] Received ${signal}, disconnecting...`);
    await disconnectKafka();
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  globalForKafka.__kafkaListenersRegistered = true;
}

