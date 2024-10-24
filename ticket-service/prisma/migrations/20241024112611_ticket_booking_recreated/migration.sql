/*
  Warnings:

  - The `seat_no` column on the `ticket_booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ticket_booking" DROP COLUMN "seat_no",
ADD COLUMN     "seat_no" INTEGER[];

-- CreateIndex
CREATE UNIQUE INDEX "ticket_booking_schedule_date_seat_no_start_place_end_place__key" ON "ticket_booking"("schedule_date", "seat_no", "start_place", "end_place", "trainId");
