-- CreateEnum
CREATE TYPE "Booking_Status" AS ENUM ('BOOKED', 'CONFIRMED');

-- CreateTable
CREATE TABLE "ticket_booking" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "schedule_date" TIMESTAMP(3) NOT NULL,
    "purchased_at" TIMESTAMP(3) NOT NULL,
    "start_place" TEXT NOT NULL,
    "end_place" TEXT NOT NULL,
    "trainId" TEXT NOT NULL,
    "seat_no" INTEGER NOT NULL,
    "status" "Booking_Status" NOT NULL DEFAULT 'BOOKED',

    CONSTRAINT "ticket_booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ticket_booking_id_key" ON "ticket_booking"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_booking_schedule_date_seat_no_start_place_end_place__key" ON "ticket_booking"("schedule_date", "seat_no", "start_place", "end_place", "trainId");

-- AddForeignKey
ALTER TABLE "ticket_booking" ADD CONSTRAINT "ticket_booking_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "train"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
