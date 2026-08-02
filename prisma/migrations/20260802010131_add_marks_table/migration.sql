/*
  Warnings:

  - You are about to drop the column `mark` on the `products` table. All the data in the column will be lost.
  - Added the required column `mark_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "mark",
ADD COLUMN     "mark_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "marks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" TEXT NOT NULL,

    CONSTRAINT "marks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_mark_id_fkey" FOREIGN KEY ("mark_id") REFERENCES "marks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
