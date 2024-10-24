import express from "express";
import { createTrainController } from "./train.controller";

const trainRouter = express.Router();

trainRouter.post("/", createTrainController);

export default trainRouter;
