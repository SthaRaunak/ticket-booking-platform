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

router
  .route("/:eventId/tickets")
  .post(
    authMiddleware,
    RBAC("ORGANIZER"),
    validateRequest(CreateTicketSchema),
    asyncHandler(eventController.createTickets)
  );

router
  .route("/:eventId/:ticketId")
  .delete(
    authMiddleware,
    RBAC("ORGANIZER"),
    asyncHandler(eventController.deleteTicket)
  );

router
  .route("/:eventId/tickets")
  .get(asyncHandler(eventController.getTicketsByEventId));

router
  .route("/category")
  .post(
    authMiddleware,
    RBAC("ADMIN"),
    validateRequest(CreateCategorySchema),
    asyncHandler(eventController.createCategory)
  );

router.route("/").get(asyncHandler(eventController.getEvents));

router.route("/:eventId").get(asyncHandler(eventController.getEventById));

export default router;
