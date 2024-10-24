import { NotificationService } from "./notification.service";

async function startService() {
  const notificationService = new NotificationService();
  await notificationService.initialize();

  // Handle application shutdown
  process.on("SIGINT", async () => {
    await notificationService.closeConnection();
    process.exit(0);
  });
}

startService().catch(console.error);
