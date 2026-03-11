/*
  Warnings:

  - You are about to drop the column `route` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `streetNumber` on the `order` table. All the data in the column will be lost.
  - Added the required column `streetAddress` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "route",
DROP COLUMN "streetNumber",
ADD COLUMN     "streetAddress" TEXT NOT NULL;
