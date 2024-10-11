/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Item_title_key" ON "Item"("title");
