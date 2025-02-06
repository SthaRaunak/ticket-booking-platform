import express from "express";
import rootRouter from "./routes";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { errorMiddlware } from "./middlewares/error.middleware";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(helmet());
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

  app.use(morgan("dev"));

  app.use(cors());

  /* configuration */

  /* route */
  app.use("/api/v0", rootRouter);

  app.use(errorMiddlware);

  return app;
}
