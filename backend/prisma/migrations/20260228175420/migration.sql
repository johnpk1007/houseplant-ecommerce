/*
  Warnings:

  - You are about to drop the column `stripePriceId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `stripeProductId` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "stripePriceId",
DROP COLUMN "stripeProductId";
