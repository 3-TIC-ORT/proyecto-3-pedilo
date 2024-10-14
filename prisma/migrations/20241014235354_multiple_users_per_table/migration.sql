/*
  Warnings:

  - You are about to drop the column `userId` on the `tables` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tables" DROP CONSTRAINT "tables_userId_fkey";

-- DropForeignKey
ALTER TABLE "tables" DROP CONSTRAINT "tables_waiterId_fkey";

-- AlterTable
ALTER TABLE "tables" DROP COLUMN "userId",
ALTER COLUMN "waiterId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TableUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tableNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TableUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TableUser_userId_tableNumber_key" ON "TableUser"("userId", "tableNumber");

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_waiterId_fkey" FOREIGN KEY ("waiterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableUser" ADD CONSTRAINT "TableUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableUser" ADD CONSTRAINT "TableUser_tableNumber_fkey" FOREIGN KEY ("tableNumber") REFERENCES "tables"("tableNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
