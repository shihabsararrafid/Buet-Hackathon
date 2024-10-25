require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

// * Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:80", // Nginx running on port 80
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
    ],
  })
);
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
