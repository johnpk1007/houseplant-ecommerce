/*
  Warnings:

  - You are about to drop the column `administrative_area_level_1` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `extended_address` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `street_number` on the `order` table. All the data in the column will be lost.
  - Added the required column `administrativeAreaLevel1` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extendedAddress` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetNumber` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "administrative_area_level_1",
DROP COLUMN "extended_address",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "phone_number",
DROP COLUMN "postal_code",
DROP COLUMN "street_number",
ADD COLUMN     "administrativeAreaLevel1" TEXT NOT NULL,
ADD COLUMN     "extendedAddress" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "streetNumber" TEXT NOT NULL;
