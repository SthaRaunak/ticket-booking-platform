import { User } from "@prisma/client";
import Express, { Request } from "express";

//to make the file a module and void Typescript error
export {};
//declaration merging
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
