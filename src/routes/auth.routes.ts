import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import { registerUserSchema } from "../schemas/auth.schemas";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router
  .route("/sign-up")
  .post(
    validateRequest(registerUserSchema),
    asyncHandler(authController.registerUser)
  );

export default router;
