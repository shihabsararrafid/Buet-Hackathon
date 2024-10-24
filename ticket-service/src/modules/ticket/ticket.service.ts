import { Prisma } from "@prisma/client";
import createHttpError from "http-errors";
import prisma from "../../../database/dbConnection";

export const BookTicketService = async (
  data: Prisma.ticket_bookingCreateInput
) =>
  prisma.ticket_booking
    .create({
      data: data,
    })
    .catch((err: any) => {
      throw !(err instanceof Prisma.PrismaClientKnownRequestError)
        ? err
        : err.code === "P2001"
        ? new createHttpError.NotFound("Train not found")
        : err.code === "P2002"
        ? new createHttpError.BadRequest("Ticket is already booked")
        : new createHttpError[500]("Unknown Error Occurred in DB");
    });
export const ConfirmTicketService = async (bookingId: string) => {
  const data = await prisma.ticket_booking
    .update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CONFIRMED",
      },
    })
    .catch((err: any) => {
      throw !(err instanceof Prisma.PrismaClientKnownRequestError)
        ? err
        : err.code === "P2001"
        ? new createHttpError.NotFound("Train not found")
        : err.code === "P2002"
        ? new createHttpError.BadRequest("Ticket is already booked")
        : new createHttpError[500]("Unknown Error Occurred in DB");
    });
  return data;
};
