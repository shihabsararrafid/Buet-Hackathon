// src/services/rabbitmq.service.ts
import amqp, { Channel, Connection } from "amqplib";

export class RabbitMQService {
  private static instance: RabbitMQService;
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private constructor() {}

  static getInstance(): RabbitMQService {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
    }
    return RabbitMQService.instance;
  }

  async initialize() {
    try {
      this.connection = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://localhost"
      );
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange("notification_events", "topic", {
        durable: true,
      });

      console.log("RabbitMQ initialized successfully");
    } catch (error) {
      console.error("Error initializing RabbitMQ:", error);
      throw error;
    }
  }

  async publishNotification(routingKey: string, data: any) {
    try {
      if (!this.channel) {
        throw new Error("RabbitMQ channel not initialized");
      }

      await this.channel.publish(
        "notification_events",
        routingKey,
        Buffer.from(JSON.stringify(data))
      );
    } catch (error) {
      console.error("Error publishing notification:", error);
      // Don't throw the error to prevent disrupting the main flow
      // Just log it since notification failure shouldn't fail the ticket operation
    }
  }
}
