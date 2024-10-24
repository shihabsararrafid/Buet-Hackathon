"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_config_1 = require("./config/email.config");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport(email_config_1.emailConfig);
    }
    async sendEmail(_to, subject, html) {
        try {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: "shrafid.532@gmail.com",
                subject,
                html,
            };
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Email sent successfully:", info.messageId);
            return true;
        }
        catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}
exports.default = EmailService;
//# sourceMappingURL=email.service.js.map