/*
  Warnings:

  - Added the required column `description` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
