-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('UNPUBLISHED', 'DELETED', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT E'PUBLISHED';
