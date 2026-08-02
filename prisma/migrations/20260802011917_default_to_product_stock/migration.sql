/*
  Warnings:

  - Made the column `stock` on table `products_stock` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products_stock" ALTER COLUMN "stock" SET NOT NULL,
ALTER COLUMN "stock" SET DEFAULT 0;
