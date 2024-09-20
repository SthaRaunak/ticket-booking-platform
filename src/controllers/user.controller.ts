import { Request, Response } from "express";
import { prismaClient } from "../index";
import { SuccessResponse } from "../utils/sucessResponse";

const createGuestUser = async (req: Request, res: Response) => {
  const { firstname, lastname, email, phone } = req.body;
  const guestUser = await prismaClient.guestUser.create({
    data: {
      email,
      firstname,
      lastname,
      phone,
    },
  });

  return res.status(200).json(new SuccessResponse(200, guestUser));
};

export { createGuestUser };
