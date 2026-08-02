/*
  Warnings:

  - The primary key for the `numeration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `numeration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "numeration" DROP CONSTRAINT "numeration_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "numeration_pkey" PRIMARY KEY ("module", "type");
