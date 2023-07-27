import amqp from 'amqplib';
import pino from "pino"
const exchangeName = process.env.RMQ_EXCHANGE_NAME || 'Task';
const queueName = process.env.RMQ_QUEUE_NAME || 'task_action';
const routingKey = process.env.RMQ_QUEUE_NAME || 'keyTask';
const logger = pino();

export type ActionHandler = (action: string, payload: any) => Promise<any>;


export async function getRabbitMQService(actionHandler:ActionHandler) {
    try {
        const connection = await amqp.connect('amqp://rabbitmq');
        return new RabbitMQService(connection, actionHandler);
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}

export class RabbitMQService {
    private connection: amqp.Connection;
    private actionHandler: ActionHandler;
  
    constructor(connection: amqp.Connection, actionHandler: ActionHandler) {
      this.connection = connection;
      this.actionHandler = actionHandler;
      this.setupConsumer();
    }
  
    private async setupConsumer() {
      try {
        const channel = await this.connection.createChannel();
  
        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(queueName, exchangeName, routingKey);
  
        channel.consume(queueName, async (message) => {
          if (message) {
            const data = JSON.parse(message.content.toString());
            const correlationId = message.properties.correlationId;
            const { action, payload , requestId} = data;
            logger.info(`Recepient message ${JSON.stringify(data)}`);
  
            try {
              
              const result = await this.actionHandler(action, payload);
              
              
              const responseMessage = {
                type: 'result',
                payload: result,
              };
              channel.sendToQueue(message.properties.replyTo, Buffer.from(JSON.stringify(responseMessage)), {
                correlationId: correlationId
              });
              logger.info(`Send message ${JSON.stringify({...responseMessage, requestId})}`);
  
              
              channel.ack(message);
            } catch (error: any) {
              
              const responseMessage = {
                type: 'error',
                payload: { error: error.message },
              };
              channel.sendToQueue(message.properties.replyTo, Buffer.from(JSON.stringify(responseMessage)), {
                correlationId:correlationId
              });
              logger.warn(`Send error ${JSON.stringify({...responseMessage, requestId})}`);
              
              channel.nack(message, false, true);
            }
          }
        });
      } catch (error) {
        logger.error(error);
        throw error;
      }
    }
  }
  