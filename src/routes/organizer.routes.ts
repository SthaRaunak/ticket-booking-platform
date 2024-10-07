import { Router } from "express";
import * as organizerController from "../controllers/oraganizer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middlewares/validation.middleware";
import { makeOrganizerSchema } from "../schemas/organizer.schema";

const router = Router();

router
  .route("/")
  .post(
    authMiddleware,
    validateRequest(makeOrganizerSchema),
    asyncHandler(organizerController.makeOrganizer)
  );

export default router;
