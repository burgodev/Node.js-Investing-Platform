-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "monthly_gain_id" UUID;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- CreateTable
CREATE TABLE "monthly_gains" (
    "id" UUID NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "percentage_profit" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,

    CONSTRAINT "monthly_gains_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_monthly_gain_id_fkey" FOREIGN KEY ("monthly_gain_id") REFERENCES "monthly_gains"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_gains" ADD CONSTRAINT "monthly_gains_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
