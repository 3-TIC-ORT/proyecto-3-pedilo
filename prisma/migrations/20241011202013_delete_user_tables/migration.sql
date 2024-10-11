/*
  Warnings:

  - You are about to drop the `Chef` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Manager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Waiter` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Chef" DROP CONSTRAINT "Chef_userId_fkey";

-- DropForeignKey
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_userId_fkey";

-- DropForeignKey
ALTER TABLE "Waiter" DROP CONSTRAINT "Waiter_userId_fkey";

-- DropForeignKey
ALTER TABLE "tables" DROP CONSTRAINT "tables_waiterId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'user';

-- AlterTable
ALTER TABLE "tables" ALTER COLUMN "waiterId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Chef";

-- DropTable
DROP TABLE "Manager";

-- DropTable
DROP TABLE "Waiter";

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_waiterId_fkey" FOREIGN KEY ("waiterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
