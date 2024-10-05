/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'ORGANIZER', 'ADMIN');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role";

-- DropEnum
DROP TYPE "UserRoles";

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'USER'
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_role_userId_key" ON "UserRole"("role", "userId");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
