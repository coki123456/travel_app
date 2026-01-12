/*
  Warnings:

  - A unique constraint covering the columns `[tripId,date]` on the table `Day` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Day_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "Day_tripId_date_key" ON "Day"("tripId", "date");
