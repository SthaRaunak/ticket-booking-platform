import { $Enums, User } from "@prisma/client";

//to make the file a module and void Typescript error
export {};
//declaration merging
declare global {
  namespace Express {
    interface Request {
      user?: User & { roles: $Enums.Roles[] };
    }
  }
}
