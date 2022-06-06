-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "percentual_liquid_profit" DOUBLE PRECISION,
ADD COLUMN     "percentual_raw_profit" DOUBLE PRECISION,
ADD COLUMN     "user_balance_before_transaction" DOUBLE PRECISION;
