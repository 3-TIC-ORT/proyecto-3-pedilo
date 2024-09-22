/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Waiter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Waiter_userId_key" ON "Waiter"("userId");
