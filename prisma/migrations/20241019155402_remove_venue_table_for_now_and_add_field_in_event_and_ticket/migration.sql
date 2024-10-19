/*
  Warnings:

  - You are about to drop the column `venueId` on the `event` table. All the data in the column will be lost.
  - You are about to drop the `venue` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_venueId_fkey";

-- AlterTable
ALTER TABLE "event" DROP COLUMN "venueId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "lat" TEXT NOT NULL,
ADD COLUMN     "lng" TEXT NOT NULL,
ADD COLUMN     "venue" TEXT NOT NULL,
ALTER COLUMN "facebook" DROP NOT NULL,
ALTER COLUMN "instagram" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ticket" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "venue";
