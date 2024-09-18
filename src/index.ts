import express from "express";
import { SuccessResponse } from "./utils/sucessResponse";
import helmet from "helmet";
import morgan from "morgan";
import cors, { type CorsOptions } from "cors";
import dotenv from "dotenv";

/* configuration */
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("dev"));

app.use(cors());

/* configuration */

/* route */
app.get("/", (req, res) => {
  res
    .status(200)
    .json(new SuccessResponse(200, { data: "hello world" }, "success"));
});

/* server */
const PORT = process.env.PORT || 4000;

app
  .listen(app.get("port"), () => {
    console.log(`Server running on at https://localhost:${PORT}`);
  })
  .on("error", (error) => {
    console.error(error.message);
    process.exit(1);
  });
