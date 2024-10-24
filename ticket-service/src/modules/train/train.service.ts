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
export const getTrains = async (data: {
  start_place: string;
  end_place: string;
  schedule_date: Date;
}) => {
  try {
    const result = await prisma.train.find({
      where: {
        start_date: data.start_place,
        end_place: data.end_place,
      },
      include: {
        ticket_booking: {
          start_date: data.start_place,
          end_place: data.end_place,
          schedule_date: data.schedule_date,
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
