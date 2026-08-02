/*
  Warnings:

  - You are about to drop the column `profile` on the `users` table. All the data in the column will be lost.
  - Added the required column `profile_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_profile_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profile",
ADD COLUMN     "profile_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
