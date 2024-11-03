/*
  Warnings:

  - The primary key for the `Cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `amount` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Cart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tableNumber]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Cart` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `tableNumber` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waiterId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_pkey",
DROP COLUMN "amount",
DROP COLUMN "itemId",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "tableNumber" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "waiterId" TEXT NOT NULL,
ADD CONSTRAINT "Cart_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "addedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_itemId_key" ON "CartItem"("cartId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_tableNumber_key" ON "Cart"("tableNumber");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_tableNumber_fkey" FOREIGN KEY ("tableNumber") REFERENCES "tables"("tableNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_waiterId_fkey" FOREIGN KEY ("waiterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
