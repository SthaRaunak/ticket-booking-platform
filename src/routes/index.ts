import { Router } from "express";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";
const rootRouter = Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/auth", authRouter);
export default rootRouter;
