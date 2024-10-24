import express from "express";
import { BookTicket, ConfirmTicket } from "./ticket.controller";

const ticketRouter = express.Router();

ticketRouter.post("/book-ticket", BookTicket);
ticketRouter.post("/confirm-ticket/:id", ConfirmTicket);

export default ticketRouter;
