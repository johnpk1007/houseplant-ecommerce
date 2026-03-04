/*
  Warnings:

  - Added the required column `administrative_area_level_1` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extended_address` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locality` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `route` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street_number` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "administrative_area_level_1" TEXT NOT NULL,
ADD COLUMN     "extended_address" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "locality" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ADD COLUMN     "postal_code" TEXT NOT NULL,
ADD COLUMN     "route" TEXT NOT NULL,
ADD COLUMN     "street_number" TEXT NOT NULL;
