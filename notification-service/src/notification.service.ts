import amqp, { Channel, Connection } from "amqplib";
import EmailService from "./email.service";

export class NotificationService {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async initialize() {
    try {
      // Connect to RabbitMQ
      this.connection = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://localhost"
      );
      this.channel = await this.connection.createChannel();

      // Setup exchanges and queues
      await this.channel.assertExchange("notification_events", "topic", {
        durable: true,
      });
      const queue = await this.channel.assertQueue("email_notifications", {
        durable: true,
      });

      // Bind queue to exchange with routing patterns
      await this.channel.bindQueue(
        queue.queue,
        "notification_events",
        "notification.email.*"
      );

      // Start consuming messages
      await this.channel.consume(queue.queue, async (msg) => {
        if (msg) {
          try {
            console.log(msg);
            const content = JSON.parse(msg.content.toString());
            await this.processNotification(content);
            this.channel?.ack(msg);
          } catch (error) {
            console.error("Error processing message:", error);
            // Reject the message and requeue if needed
            this.channel?.nack(msg, false, true);
          }
        }
      });

      console.log("Notification service initialized successfully");
    } catch (error) {
      console.error("Error initializing notification service:", error);
      throw error;
    }
  }

  private async processNotification(content: any) {
    const { to, subject, template, data } = content;
    const html = this.getEmailTemplate(template, data);
    await this.emailService.sendEmail(to, subject, html);
  }

  private getEmailTemplate(template: string, data: any): string {
    // Simple template processing, you can enhance this based on your needs
    switch (template) {
      case "ticket_created":
        return `
          <h1>New Ticket Created</h1>
          <p>Ticket ID: ${data.ticketId}</p>
          <p>Title: ${data.title}</p>
          <p>Description: ${data.description}</p>
        `;

      case "ticket_updated":
        return `
          <h1>Ticket Updated</h1>
          <p>Ticket ID: ${data.ticketId}</p>
          <p>New Status: ${data.status}</p>
          <p>Updated by: ${data.updatedBy}</p>
        `;

      default:
        return `<p>${JSON.stringify(data)}</p>`;
    }
  }

  async closeConnection() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
