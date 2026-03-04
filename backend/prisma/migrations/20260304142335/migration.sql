/*
  Warnings:

  - You are about to drop the column `stripeSessionId` on the `order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "order_stripeSessionId_key";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "stripeSessionId";
