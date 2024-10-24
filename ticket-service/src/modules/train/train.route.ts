import express from "express";
import { createTrainController, getTrains } from "./train.controller";
import { requestValidator } from "../../middlewares/request-validator";
import { TicketSchema } from "../../validators/ticket";

const trainRouter = express.Router();

trainRouter.post("/", createTrainController);
trainRouter.get("/", getTrains);

export default trainRouter;
