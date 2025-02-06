import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createApp } from "./app";

/* configuration */

dotenv.config();

export const app = createApp();

export const prismaClient = new PrismaClient({
  log: ["query"],
});

/* server */
const PORT = process.env.PORT || 4000;

app
  .listen(PORT, () => {
    console.log(`Server running on at http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    console.error(error.message);
    process.exit(1);
  });
