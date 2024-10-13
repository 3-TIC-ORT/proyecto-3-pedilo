/*
  Warnings:

  - Made the column `waiterId` on table `tables` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "tables" DROP CONSTRAINT "tables_waiterId_fkey";

-- AlterTable
CREATE SEQUENCE tables_tablenumber_seq;
ALTER TABLE "tables" ALTER COLUMN "tableNumber" SET DEFAULT nextval('tables_tablenumber_seq'),
ALTER COLUMN "waiterId" SET NOT NULL;
ALTER SEQUENCE tables_tablenumber_seq OWNED BY "tables"."tableNumber";

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_waiterId_fkey" FOREIGN KEY ("waiterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
