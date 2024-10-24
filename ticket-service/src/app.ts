import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application, Response, Request } from "express";

const app: Application = express();
app.use(
  cors({
    origin: [],
  })
);
app.use(cookieParser("510bfab8589cb8799ef2"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// importing router
/**
 * Here each router will have their different route
 * for example :
 * to use userRouter endpoints the url must start with /api/v1/user/
 */

export default app;
