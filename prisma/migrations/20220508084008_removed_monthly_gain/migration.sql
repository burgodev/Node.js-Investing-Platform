/*
  Warnings:

  - You are about to drop the column `monthly_gain_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `monthly_gains` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "monthly_gains" DROP CONSTRAINT "monthly_gains_created_by_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_monthly_gain_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "monthly_gain_id";

-- DropTable
DROP TABLE "monthly_gains";
