/*
  Warnings:

  - A unique constraint covering the columns `[productId,cartId]` on the table `cartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cartItem_productId_cartId_key" ON "cartItem"("productId", "cartId");
