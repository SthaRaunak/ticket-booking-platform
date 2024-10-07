import { Router } from "express";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";
import organizerRouter from "./organizer.routes";

const rootRouter = Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/organizer", organizerRouter);

export default rootRouter;
