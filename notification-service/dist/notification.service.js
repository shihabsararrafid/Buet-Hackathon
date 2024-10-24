"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const email_service_1 = __importDefault(require("./email.service"));
class NotificationService {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.emailService = new email_service_1.default();
    }
    async initialize() {
        try {
            this.connection = await amqplib_1.default.connect(process.env.RABBITMQ_URL || "amqp://localhost");
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange("notification_events", "topic", {
                durable: true,
            });
            const queue = await this.channel.assertQueue("email_notifications", {
                durable: true,
            });
            await this.channel.bindQueue(queue.queue, "notification_events", "notification.email.*");
            await this.channel.consume(queue.queue, async (msg) => {
                var _a, _b;
                if (msg) {
                    try {
                        console.log(msg);
                        const content = JSON.parse(msg.content.toString());
                        await this.processNotification(content);
                        (_a = this.channel) === null || _a === void 0 ? void 0 : _a.ack(msg);
                    }
                    catch (error) {
                        console.error("Error processing message:", error);
                        (_b = this.channel) === null || _b === void 0 ? void 0 : _b.nack(msg, false, true);
                    }
                }
            });
            console.log("Notification service initialized successfully");
        }
        catch (error) {
            console.error("Error initializing notification service:", error);
            throw error;
        }
    }
    async processNotification(content) {
        const { to, subject, template, data } = content;
        const html = this.getEmailTemplate(template, data);
        await this.emailService.sendEmail(to, subject, html);
    }
    getEmailTemplate(template, data) {
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
        var _a, _b;
        await ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.close());
        await ((_b = this.connection) === null || _b === void 0 ? void 0 : _b.close());
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map