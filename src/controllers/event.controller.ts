import z from "zod";
import { SuccessResponse, SucessCode } from "../utils/sucessResponse";
import { prismaClient } from "..";
import { Request, Response, NextFunction } from "express";
import {
  CreateCategorySchema,
  CreateEventSchema,
} from "../schemas/event.schemas";
import { UnauthorizedException } from "../exceptions/Unauthorized";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/BadRequest";

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
    SucessCode.CREATED,
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
    SucessCode.CREATED,
    category,
    "Category successfully created."
  );

  return res.status(response.statusCode).json(response);
};

export { createEvent, createCategory };
