import express from "express";

const ticketRouter = express.Router();

ticketRouter.post("/book-ticket");
ticketRouter.post("/confirm-ticket/:id");

export default ticketRouter;
