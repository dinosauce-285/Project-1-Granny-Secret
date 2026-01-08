/*
  Warnings:

  - You are about to drop the column `rating` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "rating",
ADD COLUMN     "favourite" BOOLEAN NOT NULL DEFAULT false;
