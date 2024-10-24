// common/rabbitmq.service.ts

import amqp, { Channel, Connection } from "amqplib";

export class RabbitMQService {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  constructor(private readonly url: string = "amqp://localhost") {}

  async connect() {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      console.log("Successfully connected to RabbitMQ");
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      throw error;
    }
  }

  async publishMessage(exchange: string, routingKey: string, message: any) {
    try {
      if (!this.channel) {
        throw new Error("Channel not initialized");
      }

      await this.channel.assertExchange(exchange, "topic", { durable: true });

      const messageBuffer = Buffer.from(JSON.stringify(message));
      this.channel.publish(exchange, routingKey, messageBuffer);

      console.log(
        `Message published to exchange ${exchange} with routing key ${routingKey}`
      );
    } catch (error) {
      console.error("Error publishing message:", error);
      throw error;
    }
  }

  async subscribe(
    exchange: string,
    queue: string,
    routingKey: string,
    handler: (message: any) => Promise<void>
  ) {
    try {
      if (!this.channel) {
        throw new Error("Channel not initialized");
      }

      await this.channel.assertExchange(exchange, "topic", { durable: true });
      const q = await this.channel.assertQueue(queue, { durable: true });

      await this.channel.bindQueue(q.queue, exchange, routingKey);

      console.log(
        `Listening for messages on queue ${queue} with routing key ${routingKey}`
      );

      this.channel.consume(q.queue, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            await handler(content);
            this.channel?.ack(msg);
          } catch (error) {
            console.error("Error processing message:", error);
            // Nack the message if processing fails
            this.channel?.nack(msg, false, true);
          }
        }
      });
    } catch (error) {
      console.error("Error setting up subscription:", error);
      throw error;
    }
  }

  async closeConnection() {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
      throw error;
    }
  }
}
