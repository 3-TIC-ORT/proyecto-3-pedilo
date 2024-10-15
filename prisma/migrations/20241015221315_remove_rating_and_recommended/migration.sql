/*
  Warnings:

  - You are about to drop the column `rating` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `recommended` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "rating",
DROP COLUMN "recommended";
