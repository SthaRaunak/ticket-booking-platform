import { Router } from "express";

import * as userController from "../controllers/user.controller";

const router = Router();

router.route("/guest").post(userController.createGuestUser);

export default router;
