import dotenv from "dotenv";

//configuration for environment  file
dotenv.config();

// Import data
import app from "./app";
import prisma from "../database/dbConnection";

// PORT
const PORT = process.env.PORT || 5000;

async function start() {
  //connecting database using prisma orm
  await prisma.$connect();

  app.listen(PORT, () => {
    console.log("\x1b[32m%s\x1b[0m", `Server is running on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error(error.message);
});
