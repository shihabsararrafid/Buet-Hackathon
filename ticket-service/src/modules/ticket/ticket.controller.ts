import { publishBookingRequest } from "./../../../utils/publishBookingRequest";
import { NextFunction, Request, Response } from "express";

import { isHttpError } from "http-errors";
import { BookTicketService, ConfirmTicketService } from "./ticket.service";
import { RabbitMQService } from "../../services/rabbitmq.service";

const rabbitMQService = RabbitMQService.getInstance();
rabbitMQService.initialize();
export const BookTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = publishBookingRequest(req.body);
    const responseMessage = {
      status: "Success",
      message: "Ticket Booked Successfully",
      result: data,
    };
    console.log("hello");

    // req.responseMessage = responseMessage;
    res.status(200).json(responseMessage);
  } catch (error) {
    const responseMessage = {
      status: "Failed",
      message: "Failed to book ticket",
      error: error instanceof Error ? error.message : "Unexpected Error",
    };
    // req.responseMessage = responseMessage;
    res
      .status(isHttpError(error) ? error.statusCode : 400)
      .json(responseMessage);
  }
  next();
};
export const ConfirmTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = await ConfirmTicketService(id);
    const responseMessage = {
      status: "Success",
      message: "Ticket Confirmed",
      result: data,
    };
    // Send notification
    await rabbitMQService.publishNotification(
      "notification.email.ticket_booked",
      {
        to: data.userEmail, // Assuming your ticket data has userEmail
        subject: "Ticket Booking Confirmation",
        template: "ticket_booked",
        data: {
          ticketId: data.id,
          bookingDetails: {
            ...data,
            bookingTime: new Date().toISOString(),
          },
        },
      }
    );
    // req.responseMessage = responseMessage;
    res.status(200).json(responseMessage);
  } catch (error) {
    const responseMessage = {
      status: "Failed",
      message: "Ticket Confirmation Failed",
      error: error instanceof Error ? error.message : "Unexpected Error",
    };
    // req.responseMessage = responseMessage;
    res
      .status(isHttpError(error) ? error.statusCode : 400)
      .json(responseMessage);
  }
  next();
};
