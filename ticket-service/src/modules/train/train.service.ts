import { train } from "./../../../node_modules/.prisma/client/index.d";
import { Prisma } from "@prisma/client";
import prisma from "../../../database/dbConnection";
import createHttpError from "http-errors";

export const createTrains = (data: Prisma.trainCreateInput) =>
  prisma.train
    .create({
      data: data,
    })
    .catch((err: any) => {
      throw err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2001"
        ? new createHttpError.NotFound("Train not found")
        : err;
    });
