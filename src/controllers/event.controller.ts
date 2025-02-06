import z from "zod";
import { SuccessResponse, SuccessCode } from "../utils/sucessResponse";
import { prismaClient } from "..";
import { Request, Response, NextFunction } from "express";
import {
  CreateCategorySchema,
  CreateEventSchema,
  CreateTicketSchema,
} from "../schemas/event.schemas";
import { UnauthorizedException } from "../exceptions/Unauthorized";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/BadRequest";
import { NotFoundException } from "../exceptions/NotFound";

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  const {
    description,
    image,
    name,
    tos,
    venue,
    address,
    lat,
    lng,
    facebook,
    instagram,
    Format,
    startTime,
    endTime,
    startDate,
    endDate,
    category,
  } = req.body as z.infer<typeof CreateEventSchema>;

  const { id: userId } = req.user!;

  const organizerProfile = await prismaClient.organizer.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  console.log(organizerProfile?.id);
  //handle error again
  if (!organizerProfile) {
    throw new UnauthorizedException(
      "Organizer profile doesnt exist for this user.",
      ErrorCode.UNAUTHORIZED
    );
  }
  //check if all category id are valid (not required as foreign key constraint is set, just to send a meaningful error to client)
  const categories = await prismaClient.category.findMany({
    where: {
      id: { in: category },
    },
    select: {
      id: true,
    },
  });

  if (categories.length !== category.length) {
    throw new BadRequestException(
      "One or more category is invalid.",
      ErrorCode.BAD_REQUEST
    );
  }

  const event = await prismaClient.event.create({
    data: {
      organizerId: organizerProfile.id,
      name,
      tos,
      venue,
      address,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      Format,
      image,
      lat,
      lng,
      instagram,
      facebook,
      EventCategory: {
        createMany: {
          data: category.map((item) => ({ categoryId: item })),
        },
      },
    },
  });

  const response = new SuccessResponse(
    SuccessCode.CREATED,
    event,
    "Event successfully created"
  );

  return res.status(response.statusCode).json(response);
};

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body as z.infer<typeof CreateCategorySchema>;

  const data = name.map((item) => {
    return { name: item };
  });

  const category = await prismaClient.category.createManyAndReturn({
    data,
    skipDuplicates: true,
    select: {
      id: true,
      name: true,
    },
  });

  const response = new SuccessResponse(
    SuccessCode.CREATED,
    category,
    "Category successfully created."
  );

  return res.status(response.statusCode).json(response);
};

const createTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tickets } = req.body as z.infer<typeof CreateTicketSchema>;
  const { eventId } = req.params;
  const { id: userId } = req.user!;

  const event = await prismaClient.event.findFirst({
    where: {
      id: eventId,
    },
    select: {
      id: true,
      organizerId: true,
    },
  });

  if (!event) {
    throw new NotFoundException("Event not found", ErrorCode.NOT_FOUND);
  }

  const organizer = await prismaClient.organizer.findFirst({
    where: {
      id: event.organizerId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (organizer?.userId !== userId) {
    throw new UnauthorizedException(
      "You are not allowed to create tickets for this event.",
      ErrorCode.UNAUTHORIZED
    );
  }

  const { ticket: createdTickets } = await prismaClient.event.update({
    where: {
      id: eventId,
    },
    data: {
      ticket: {
        createMany: {
          data: tickets,
        },
      },
    },
    select: {
      ticket: {
        select: {
          name: true,
          description: true,
          quantity: true,
          price: true,
        },
      },
    },
  });

  const response = new SuccessResponse(
    SuccessCode.CREATED,
    createdTickets,
    "Tickets for event succesfully created."
  );

  return res.status(response.statusCode).json(response);
};

const deleteTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventId, ticketId } = req.params;
  const { id: userId } = req.user!;

  const event = await prismaClient.event.findFirst({
    where: {
      id: eventId,
    },
    select: {
      id: true,
      organizerId: true,
    },
  });

  if (!event) {
    throw new NotFoundException("Event not found", ErrorCode.NOT_FOUND);
  }

  const organizer = await prismaClient.organizer.findFirst({
    where: {
      id: event.organizerId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (organizer?.userId != userId) {
    throw new UnauthorizedException(
      "You are not allowed to delete tickets for this event.",
      ErrorCode.UNAUTHORIZED
    );
  }

  await prismaClient.ticket.delete({
    where: {
      id: ticketId,
    },
  });

  const response = new SuccessResponse(
    SuccessCode.NO_CONTENT,
    {},
    "Ticket successfully deleted."
  );

  res.status(response.statusCode).send(response);
};

const getTicketsByEventId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventId } = req.params;

  const event = await prismaClient.event.findFirst({
    where: {
      id: eventId,
    },
    select: {
      id: true,
    },
  });

  if (!event) {
    throw new NotFoundException("Event not found", ErrorCode.TOKEN_NOT_FOUND);
  }

  const tickets = await prismaClient.ticket.findMany({
    where: {
      eventId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      quantity: true,
    },
  });

  const response = new SuccessResponse(
    SuccessCode.OK,
    tickets,
    "Tickets for the event succesfully fetched."
  );

  return res.status(response.statusCode).json(response);
};

const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  const { limit, offset } = req.query;
  const eventCount = await prismaClient.event.count();
  const events = await prismaClient.event.findMany({
    skip: Number(offset) || 0,
    take: Number(limit) || 10,
    orderBy: {
      startDate: "asc",
    },
    select: {
      name: true,
      image: true,
      venue: true,
      address: true,
      startDate: true,
      EventCategory: {
        select: {
          Category: {
            select: {
              name: true,
            },
          },
        },
      },
      ticket: {
        select: {
          price: true,
        },
      },
    },
  });

  const transformedEvents = events.map((event) => {
    const { EventCategory, ticket, ...rest } = {
      ...event,
      categories: event.EventCategory.map((item) => item.Category.name),
      startsFrom: Math.min(...event.ticket.map((item) => item.price)) || 0, //min ticket price
    };
    return rest;
  });

  const response = new SuccessResponse(
    SuccessCode.OK,
    { count: eventCount, events: transformedEvents },
    "Events succesfully fetched."
  );

  return res.status(response.statusCode).json(response);
};

const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventId } = req.params;

  // todo: create a middleware to validate params
  if (!eventId) {
    throw new BadRequestException(
      "Event id is required",
      ErrorCode.BAD_REQUEST
    );
  }

  const event = await prismaClient.event.findFirst({
    where: {
      id: eventId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      venue: true,
      address: true,
      startDate: true,
      endDate: true,
      startTime: true,
      endTime: true,
      Format: true,
      lat: true,
      lng: true,
      facebook: true,
      instagram: true,
      Organizer: true,
      tos: true,
    },
  });

  if (!event) {
    throw new NotFoundException("Event not found", ErrorCode.NOT_FOUND);
  }

  const response = new SuccessResponse(
    SuccessCode.OK,
    event,
    "Event successfully fetched."
  );

  res.status(response.statusCode).json(response);
};

export {
  createEvent,
  createCategory,
  createTickets,
  getTicketsByEventId,
  getEvents,
  deleteTicket,
  getEventById,
};
