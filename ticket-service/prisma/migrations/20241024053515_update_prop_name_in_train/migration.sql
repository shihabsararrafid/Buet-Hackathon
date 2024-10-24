/*
  Warnings:

  - You are about to drop the column `scehedule` on the `train` table. All the data in the column will be lost.
  - Added the required column `schedule` to the `train` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "train" DROP COLUMN "scehedule",
ADD COLUMN     "schedule" TIMESTAMP(3) NOT NULL;
