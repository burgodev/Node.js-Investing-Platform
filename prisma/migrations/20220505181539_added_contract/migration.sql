-- CreateTable
CREATE TABLE "contracts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "period" INTEGER NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
