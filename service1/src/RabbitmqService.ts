import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';

const exchangeName = process.env.RMQ_EXCHANGE_NAME || 'Task';
const queueName = process.env.RMQ_QUEUE_NAME || 'task_action';
const routingKey = process.env.RMQ_QUEUE_NAME || 'keyTask';
const responseQueue = "task_response";


export async function getRabbitMQSerivce(){
    try {
        const connect = await amqp.connect('amqp://rabbitmq');
        return new RabbitMQService(connect)
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}

export class RabbitMQService {
    private connection: amqp.Connection;
  
    constructor(connection: amqp.Connection) {
      this.connection = connection;
    }
  
    private async createChannel() {
      return this.connection.createChannel();
    }
  
    private async setupQueue(channel: amqp.Channel) {
      await channel.assertExchange(exchangeName, 'direct', { durable: true });
      await channel.assertQueue(queueName, { durable: true });
      await channel.bindQueue(queueName, exchangeName, routingKey);
      await channel.assertQueue(responseQueue, { exclusive: true });
    }
  
    async sendAndReceive(action: string, payload: any, requestId:string): Promise<any> {
      try {
        const channel = await this.createChannel();
        await this.setupQueue(channel);
        const correlationId = uuidv4();
  
        const message = {
          action,
          payload,
          requestId
        };
  

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
            correlationId:correlationId,
            replyTo:responseQueue
        });
  
        const response = await this.waitForMessage(correlationId, channel);
        return response.payload;
      } catch (error: any) {
        
        throw new Error(`Error sending or receiving message: ${error.toString()}`);
      } finally{
        await this.closeConnection()
      }
    }
  
    private async waitForMessage(correlationId: string, channel: amqp.Channel): Promise<any> {
      return new Promise((resolve, reject) => {
        channel.consume(
          responseQueue,
          (message) => {
            if (message) {
              const result = JSON.parse(message.content.toString());
              if (result.type === 'result' && message.properties.correlationId === correlationId) {
                resolve(result);
              }
            }
          },
          { noAck: true }
        );
      });
    }
  
    async closeConnection() {
      try {
        if (this.connection) {
          await this.connection.close();
        }
      } catch (error) {
        console.error('Error closing RabbitMQ connection:', error);
        throw error;
      }
    }
  }