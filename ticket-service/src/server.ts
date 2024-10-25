import dotenv from "dotenv";
//configuration for environment  file
dotenv.config();

// Import data
import app from "./app";
import prisma from "../database/dbConnection";
import { consumeBookingRequests } from "./../utils/consumeBookingRequest";

// PORT
const PORT = process.env.PORT || 5000;

async function start() {
  //connecting database using prisma orm
  await prisma.$connect();

  app.listen(PORT, () => {
    console.log("\x1b[32m%s\x1b[0m", `Server is running on port ${PORT}`);
    // Call the RabbitMQ consumer to start consuming booking requests
    consumeBookingRequests().catch((error) => {
      console.error("Error starting booking consumer:", error);
    });
  });
}

start().catch((error) => {
  console.error(error.message);
});
