import { Prisma } from "@prisma/client";
import createHttpError from "http-errors";
import prisma from "../../../database/dbConnection";

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
export const getTrainsService = async (data: {
  start_place: any;
  end_place: any;
  schedule_date: any;
}) => {
  try {
    const result = await prisma.train.findMany({
      where: {
        start_place: data.start_place,
        end_place: data.end_place,
      },
      include: {
        tickets: {
          where: {
            schedule_date: data.schedule_date,
            start_place: data.start_place,
            end_place: data.end_place,
          },
        },
      },
    });
    return result;
  } catch (error) {
    throw error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2001"
      ? new createHttpError.NotFound("Train not found")
      : error;
  }
};
