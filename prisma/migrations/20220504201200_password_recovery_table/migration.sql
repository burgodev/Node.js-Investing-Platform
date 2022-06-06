-- CreateTable
CREATE TABLE "password_recoveries" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "token" TEXT NOT NULL,

    CONSTRAINT "password_recoveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_recoveries_token_key" ON "password_recoveries"("token");

-- AddForeignKey
ALTER TABLE "password_recoveries" ADD CONSTRAINT "password_recoveries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
