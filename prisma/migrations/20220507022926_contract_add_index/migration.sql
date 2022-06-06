/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `contracts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "contracts_user_id_key" ON "contracts"("user_id");
