/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `organizer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `organizer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organizer" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "facebook" DROP NOT NULL,
ALTER COLUMN "instagram" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "organizer_userId_key" ON "organizer"("userId");

-- AddForeignKey
ALTER TABLE "organizer" ADD CONSTRAINT "organizer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
