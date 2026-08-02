-- CreateEnum
CREATE TYPE "inventory_operation_types" AS ENUM ('LOAD', 'DOWNLOAD');

-- CreateEnum
CREATE TYPE "sales_operation_types" AS ENUM ('SALE', 'QUOTATION', 'ORDER');

-- CreateEnum
CREATE TYPE "shopping_operation_types" AS ENUM ('SHOPPING', 'EXPENSE');

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR NOT NULL,
    "description" VARCHAR,
    "client_id" VARCHAR,
    "email" VARCHAR,
    "phone" VARCHAR,
    "country" VARCHAR,
    "city" VARCHAR,
    "address" VARCHAR,
    "credit_days" INTEGER,
    "credit_limit" DOUBLE PRECISION,
    "discount" DOUBLE PRECISION,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_operation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "operation_type" "inventory_operation_types" NOT NULL,
    "document_no" VARCHAR,
    "emission_date" TIMESTAMP(6),
    "description" VARCHAR,
    "total" DOUBLE PRECISION DEFAULT 0,
    "total_net" DOUBLE PRECISION DEFAULT 0,
    "total_tax" DOUBLE PRECISION DEFAULT 0,
    "user_id" UUID,
    "total_details" INTEGER DEFAULT 0,
    "total_amount" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "inventory_operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_operation_details" (
    "main_id" UUID NOT NULL,
    "line" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID,
    "description_product" VARCHAR,
    "amount" DOUBLE PRECISION,
    "unit" UUID,
    "unitary_cost" DOUBLE PRECISION,
    "aliquot" DOUBLE PRECISION,
    "total_cost" DOUBLE PRECISION DEFAULT 0,
    "total_tax" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "inventory_operation_details_pkey" PRIMARY KEY ("main_id","line")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR NOT NULL,
    "description" VARCHAR,
    "mark" VARCHAR,
    "model" VARCHAR,
    "referenc" VARCHAR,
    "discount" DOUBLE PRECISION,
    "status" BOOLEAN,
    "origin" VARCHAR,
    "buy_tax" DOUBLE PRECISION,
    "sale_tax" DOUBLE PRECISION,
    "image_url" VARCHAR,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_stock" (
    "product_id" UUID NOT NULL,
    "unit" UUID NOT NULL,
    "stock" DOUBLE PRECISION,

    CONSTRAINT "products_stock_pkey" PRIMARY KEY ("product_id","unit")
);

-- CreateTable
CREATE TABLE "products_units" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "unit" VARCHAR,
    "product_id" UUID NOT NULL,
    "cost" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,

    CONSTRAINT "products_units_pkey" PRIMARY KEY ("product_id","id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" VARCHAR,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_operation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "operation_type" "sales_operation_types" NOT NULL,
    "document_no" VARCHAR,
    "emission_date" TIMESTAMP(6),
    "client_id" UUID,
    "seller" VARCHAR,
    "credit_days" INTEGER,
    "description" VARCHAR,
    "user_id" UUID,
    "total_amount" DOUBLE PRECISION DEFAULT 0,
    "percent_discount" DOUBLE PRECISION DEFAULT 0,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "total_net" DOUBLE PRECISION DEFAULT 0,
    "total_exempt" DOUBLE PRECISION DEFAULT 0,
    "total_tax" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "credit" DOUBLE PRECISION DEFAULT 0,
    "cash" DOUBLE PRECISION DEFAULT 0,
    "total_net_cost" DOUBLE PRECISION DEFAULT 0,
    "total_tax_cost" DOUBLE PRECISION DEFAULT 0,
    "total_cost" DOUBLE PRECISION DEFAULT 0,
    "total_count_details" DOUBLE PRECISION DEFAULT 0,
    "pending" BOOLEAN,

    CONSTRAINT "sales_operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_operation_details" (
    "main_id" UUID NOT NULL,
    "line" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID,
    "description_product" VARCHAR,
    "amount" DOUBLE PRECISION,
    "unit" UUID,
    "unitary_cost" DOUBLE PRECISION,
    "sale_aliquot" DOUBLE PRECISION,
    "buy_aliquot" DOUBLE PRECISION,
    "price" DOUBLE PRECISION DEFAULT 0,
    "total_net_cost" DOUBLE PRECISION DEFAULT 0,
    "total_tax_cost" DOUBLE PRECISION DEFAULT 0,
    "total_cost" DOUBLE PRECISION DEFAULT 0,
    "percent_discount" DOUBLE PRECISION DEFAULT 0,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "total_net" DOUBLE PRECISION DEFAULT 0,
    "total_tax" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "sales_operation_details_pkey" PRIMARY KEY ("main_id","line")
);

-- CreateTable
CREATE TABLE "shopping_operation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "operation_type" "shopping_operation_types" NOT NULL,
    "document_no" VARCHAR,
    "emission_date" TIMESTAMP(6),
    "provider_name" VARCHAR,
    "provider_id" VARCHAR,
    "provider_address" VARCHAR,
    "provider_phone" VARCHAR,
    "credit_days" INTEGER,
    "expiration_date" DATE,
    "description" VARCHAR,
    "user_id" UUID,
    "total_amount" DOUBLE PRECISION DEFAULT 0,
    "total_count_details" DOUBLE PRECISION DEFAULT 0,
    "percent_discount" DOUBLE PRECISION DEFAULT 0,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "total_net" DOUBLE PRECISION DEFAULT 0,
    "total_tax" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "credit" DOUBLE PRECISION DEFAULT 0,
    "cash" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "shopping_operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_operation_details" (
    "main_id" UUID NOT NULL,
    "line" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID,
    "description_product" VARCHAR,
    "amount" DOUBLE PRECISION,
    "unit" UUID,
    "unitary_cost" DOUBLE PRECISION,
    "percent_discount" DOUBLE PRECISION DEFAULT 0,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "total_net" DOUBLE PRECISION DEFAULT 0,
    "total_tax" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "buy_aliquot" DOUBLE PRECISION,

    CONSTRAINT "shopping_operation_details_pkey" PRIMARY KEY ("main_id","line")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profile" UUID,
    "code" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "description" VARCHAR,
    "email" VARCHAR,
    "status" BOOLEAN,
    "recovery_token" VARCHAR,
    "recovery_token_expires_at" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_units_id_key" ON "products_units"("id");

-- AddForeignKey
ALTER TABLE "inventory_operation" ADD CONSTRAINT "inventory_operation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_operation_details" ADD CONSTRAINT "inventory_operation_details_id_product_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_operation_details" ADD CONSTRAINT "inventory_operation_details_main_id_fkey" FOREIGN KEY ("main_id") REFERENCES "inventory_operation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_operation_details" ADD CONSTRAINT "inventory_operation_details_unit_fkey" FOREIGN KEY ("unit") REFERENCES "products_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_stock" ADD CONSTRAINT "products_stock_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_stock" ADD CONSTRAINT "products_stock_product_unit_fkey" FOREIGN KEY ("unit") REFERENCES "products_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_units" ADD CONSTRAINT "products_units_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_operation" ADD CONSTRAINT "sales_operation_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_operation" ADD CONSTRAINT "sales_operation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_operation_details" ADD CONSTRAINT "sales_operation_details_main_id_fkey" FOREIGN KEY ("main_id") REFERENCES "sales_operation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_operation_details" ADD CONSTRAINT "sales_operation_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_operation_details" ADD CONSTRAINT "sales_operation_details_unit_fkey" FOREIGN KEY ("unit") REFERENCES "products_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_operation" ADD CONSTRAINT "shopping_operation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_operation_details" ADD CONSTRAINT "shopping_operation_details_main_id_fkey" FOREIGN KEY ("main_id") REFERENCES "shopping_operation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_operation_details" ADD CONSTRAINT "shopping_operation_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_operation_details" ADD CONSTRAINT "shopping_operation_details_unit_fkey" FOREIGN KEY ("unit") REFERENCES "products_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profile_fkey" FOREIGN KEY ("profile") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
