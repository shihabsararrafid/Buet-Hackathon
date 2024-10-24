// server.js
// import "dotenv/config";
// import cookieParser from "cookie-parser";
// import express from "express";

// const app = express();
// const PORT = process.env.PORT || 4000;

// // * Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// app.get("/", (req, res) => {
//   return res.send("Hi Everyone. ");
// });

// // * routes file
// import userRouter from "./routes/userRoutes.js"
// import postRouter from "./routes/postRoutes.js"
// import commentRouter from "./routes/commentRoutes.js"

// app.use("/api/user", userRouter);

// app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

// server.js
require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

// * Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.send("Hi Everyone.");
});

// * routes file
const userRouter = require("./routes/userRoutes.js");
// const postRouter = require("./routes/postRoutes.js");
// const commentRouter = require("./routes/commentRoutes.js");

app.use("/api/user", userRouter);

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
