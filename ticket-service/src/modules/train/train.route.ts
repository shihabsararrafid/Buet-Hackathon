import express from "express";
import { createTrainController, getTrains } from "./train.controller";

const trainRouter = express.Router();

trainRouter.post("/", createTrainController);
trainRouter.get("/", getTrains);

export default trainRouter;
