-- AlterTable
ALTER TABLE "contracts" ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "is_expired" BOOLEAN NOT NULL DEFAULT false;
