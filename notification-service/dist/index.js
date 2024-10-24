"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notification_service_1 = require("./notification.service");
async function startService() {
    const notificationService = new notification_service_1.NotificationService();
    await notificationService.initialize();
    process.on("SIGINT", async () => {
        await notificationService.closeConnection();
        process.exit(0);
    });
}
startService().catch(console.error);
//# sourceMappingURL=index.js.map