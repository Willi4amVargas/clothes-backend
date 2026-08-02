-- CreateEnum
CREATE TYPE "modules" AS ENUM ('SALES', 'SHOPPING', 'INVENTORY_OPERATION');

-- CreateEnum
CREATE TYPE "module_types" AS ENUM ('LOAD', 'DOWNLOAD', 'SALE', 'QUOTATION', 'ORDER', 'SHOPPING', 'EXPENSE');

-- CreateTable
CREATE TABLE "numeration" (
    "id" SERIAL NOT NULL,
    "module" "modules" NOT NULL,
    "type" "module_types" NOT NULL,
    "last_numeration" INTEGER NOT NULL,
    "prefix" TEXT NOT NULL,

    CONSTRAINT "numeration_pkey" PRIMARY KEY ("id")
);
