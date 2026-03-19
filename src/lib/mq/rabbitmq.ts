import amqp, { Channel, ChannelModel } from 'amqplib';

let channelModel: ChannelModel | null = null;
let channel: Channel | null = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672';

/**
 * RabbitMQ 연결 설정
 * 
 * amqplib의 connect()는 ChannelModel을 반환하며,
 * ChannelModel.createChannel()로 Channel을 생성합니다.
 * 
 * 참고: 타입 정의상 ChannelModel이지만, 실제로는 Connection처럼 동작하며
 * createChannel() 메서드를 통해 Channel을 생성합니다.
 */
export const connectRabbitMQ = async (): Promise<Channel> => {
  if (!channelModel || !channel) {
    try {
      // amqplib의 connect()는 ChannelModel을 반환
      channelModel = await amqp.connect(RABBITMQ_URL);
      // ChannelModel.createChannel()로 Channel 생성
      channel = await channelModel.createChannel();
      
      console.log('RabbitMQ connected');
      
      // 연결 종료 시 정리
      if (channelModel) {
        channelModel.on('error', (err: Error) => {
          console.error('RabbitMQ connection error:', err);
        });
        
        channelModel.on('close', () => {
          console.log('RabbitMQ connection closed');
          channelModel = null;
          channel = null;
        });
      }
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }
  
  if (!channel) {
    throw new Error('Failed to establish RabbitMQ channel');
  }
  
  return channel;
};

/**
 * 메시지 전송 (Producer)
 * @param exchange Exchange 이름
 * @param routingKey 라우팅 키
 * @param message 메시지 객체
 * @param options 옵션 (persistent 등)
 */
export const sendRabbitMQMessage = async (
  exchange: string,
  routingKey: string,
  message: object,
  options?: { persistent?: boolean }
) => {
  try {
    const ch = await connectRabbitMQ();
    
    // Exchange 선언 (없으면 생성)
    await ch.assertExchange(exchange, 'topic', { durable: true });
    
    const messageBuffer = Buffer.from(JSON.stringify(message));
    
    // publish는 동기 메서드로 boolean을 반환합니다 (버퍼가 가득 찼는지 여부)
    const sent = ch.publish(exchange, routingKey, messageBuffer, {
      persistent: options?.persistent ?? true,
    });
    
    if (!sent) {
      // 버퍼가 가득 찬 경우 'drain' 이벤트를 기다려야 하지만,
      // 일반적인 경우에는 무시해도 됩니다
      console.warn(`Message buffer full for ${exchange} with routing key ${routingKey}`);
    }
    
    console.log(`Message sent to ${exchange} with routing key ${routingKey}`);
  } catch (error) {
    console.error('Error sending RabbitMQ message:', error);
    throw error;
  }
};


/**
 * 연결 종료
 */
export const disconnectRabbitMQ = async () => {
  if (channel) {
    await channel.close();
    channel = null;
  }
  if (channelModel) {
    await channelModel.close();
    channelModel = null;
    console.log('RabbitMQ disconnected');
  }
};

// 프로세스 종료 시 정리 (한 번만 등록)
type GlobalWithRabbitMQ = typeof globalThis & {
  __rabbitmqListenersRegistered?: boolean;
};

const globalForRabbitMQ = globalThis as GlobalWithRabbitMQ;

if (typeof process !== 'undefined' && !globalForRabbitMQ.__rabbitmqListenersRegistered) {
  const handleShutdown = async (signal: string) => {
    console.log(`[RabbitMQ] Received ${signal}, disconnecting...`);
    await disconnectRabbitMQ();
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  globalForRabbitMQ.__rabbitmqListenersRegistered = true;
}

