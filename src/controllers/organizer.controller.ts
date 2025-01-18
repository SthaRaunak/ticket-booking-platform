import { Request, Response, NextFunction } from "express";
import { prismaClient } from "..";
import { SuccessCode, SuccessResponse } from "../utils/sucessResponse";
import { BadRequestException } from "../exceptions/BadRequest";
import { ErrorCode } from "../exceptions/root";
import { makeOrganizerSchema } from "../schemas/organizer.schema";
import z from "zod";

const makeOrganizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.user!;

  const isOrganizer = await prismaClient.organizer.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (isOrganizer) {
    throw new BadRequestException(
      "User is already an organizer",
      ErrorCode.UNPROCESSABLE_ENTITY
    );
  }

  const { about, email, facebook, instagram, name, phone } =
    req.body as z.infer<typeof makeOrganizerSchema>;

  //alternative to below: use transactions
  const updatedUser = await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      organizationInfo: {
        create: {
          name,
          about,
          email,
          phone,
          facebook,
          instagram,
        },
      },
      roles: {
        create: {
          role: "ORGANIZER",
        },
      },
    },
    select: {
      organizationInfo: {
        select: {
          name: true,
          about: true,
          email: true,
          phone: true,
          facebook: true,
          instagram: true,
          createdAt: true,
        },
      },
    },
  });

  const response = new SuccessResponse(
    SuccessCode.CREATED,
    updatedUser.organizationInfo,
    "Successfuly made user an organizer"
  );

  return res.status(response.statusCode).json(response);
};

const updateOrganizer = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query as { id: string };
  const updateValues = req.body;

  const updatedOrganizer = prismaClient.organizer.update({
    where: {
      id,
    },
    data: {
      ...updateValues,
    },
  });
};

export { makeOrganizer };
