-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL DEFAULT 'PENDING';
