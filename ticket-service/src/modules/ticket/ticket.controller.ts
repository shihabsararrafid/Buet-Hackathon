import { NextFunction, Request, Response } from "express";

import { isHttpError } from "http-errors";
import { BookTicketService, ConfirmTicketService } from "./ticket.service";

export const BookTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await BookTicketService(req.body);
    const responseMessage = {
      status: "Success",
      message: "Ticket Booked Successfully",
      result: data,
    };
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
