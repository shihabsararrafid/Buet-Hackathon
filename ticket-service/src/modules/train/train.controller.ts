import { NextFunction, Request, Response } from "express";
import { createTrains } from "./train.service";
import { isHttpError } from "http-errors";

export const createTrainController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await createTrains(req.body);
    const responseMessage = {
      status: "Success",
      message: "Train Created Successfully",
      result: data,
    };
    req.responseMessage = responseMessage;
    res.status(200).json(responseMessage);
  } catch (error) {
    const responseMessage = {
      status: "Failed",
      message: "Failed to create trains",
      error: error instanceof Error ? error.message : "Unexpected Error",
    };
    req.responseMessage = responseMessage;
    res
      .status(isHttpError(error) ? error.statusCode : 400)
      .json(responseMessage);
  }
  next();
};
