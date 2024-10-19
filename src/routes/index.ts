import { Router } from "express";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";
import organizerRouter from "./organizer.routes";
import eventRouter from "./event.routes";

const rootRouter = Router();

rootRouter.use("/users", userRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/organizers", organizerRouter);
rootRouter.use("/events", eventRouter);

export default rootRouter;
