import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { RBAC } from "../middlewares/rbac.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  CreateCategorySchema,
  CreateEventSchema,
  CreateTicketSchema,
} from "../schemas/event.schemas";
import { asyncHandler } from "../utils/asyncHandler";
import * as eventController from "../controllers/event.controller";

const router = Router();

router
  .route("/")
  .post(
    authMiddleware,
    RBAC("ORGANIZER"),
    validateRequest(CreateEventSchema),
    asyncHandler(eventController.createEvent)
  );

// router
//   .route("/:eventId/ticket")
//   .post(
//     authMiddleware,
//     RBAC("ORGANIZER"),
//     validateRequest(CreateTicketSchema),
//     asyncHandler()
//   );

router
  .route("/category")
  .post(
    authMiddleware,
    RBAC("ADMIN"),
    validateRequest(CreateCategorySchema),
    asyncHandler(eventController.createCategory)
  );

export default router;
