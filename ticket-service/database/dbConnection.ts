import { PrismaClient } from "@prisma/client";
// Config
import dotenv from "dotenv";
dotenv.config();

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
