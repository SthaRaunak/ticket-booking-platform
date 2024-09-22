import { Router } from "express";

import * as userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.route("/test").post(authMiddleware, userController.createGuestUser);

export default router;
