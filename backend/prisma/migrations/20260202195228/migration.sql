/*
  Warnings:

  - You are about to drop the column `stripeId` on the `product` table. All the data in the column will be lost.
  - Added the required column `stripeProductId` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "stripeId",
ADD COLUMN     "stripeProductId" TEXT NOT NULL;
