-- CreateTable
CREATE TABLE "train" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_place" TEXT NOT NULL,
    "end_place" TEXT NOT NULL,
    "number_of_seats" TEXT NOT NULL,
    "ticket_fare" INTEGER NOT NULL DEFAULT 0,
    "scehedule" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "train_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "train_id_key" ON "train"("id");
