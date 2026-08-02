import { products_stock } from "#/client";
import { repository } from "@/config/prisma";

export class ProductsStockService {
  constructor() {}

  create = async (
    product_id: string,
    unit: string,
    productStock: Omit<products_stock, "product_id" | "unit">,
  ) => {
    try {
      const result = await repository.products_stock.create({
        data: {
          product_id,
          unit,
          ...productStock,
        },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating product stock");
    }
  };

  delete = async (product_id: string, unit: string) => {
    try {
      await repository.products_stock.delete({
        where: {
          product_id,
          unit,
        },
      });
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting product stock");
    }
  };

  getAll = async (product_id: string | string[]) => {
    try {
      const productIDIsArray = Array.isArray(product_id);
      if (productIDIsArray) {
        const result = await repository.products_stock.findMany({
          where: {
            product_id: {
              in: product_id,
            },
          },
        });
        return result;
      } else {
        const result = await repository.products_stock.findMany({
          where: {
            product_id,
          },
        });
        return result;
      }
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching products stock");
    }
  };

  getOne = async (product_id: string, unit: string) => {
    try {
      const result = await repository.products_stock.findUnique({
        where: {
          product_id,
          unit,
        },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching product stock");
    }
  };

  update = async (
    product_id: string,
    unit: string,
    productStock: Partial<Omit<products_stock, "product_id" | "unit">>,
    take_last?: boolean,
  ) => {
    try {
      const productStockExists = await this.getOne(product_id, unit);
      if (!productStockExists) {
        throw new Error("Product stock not found");
      }

      const updatedStock = { ...productStockExists, ...productStock };

      if (take_last && productStock.stock) {
        updatedStock.stock = productStockExists.stock + productStock.stock;
      }

      const result = await repository.products_stock.update({
        data: updatedStock,
        where: {
          product_id,
          unit,
        },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating product stock");
    }
  };
}
