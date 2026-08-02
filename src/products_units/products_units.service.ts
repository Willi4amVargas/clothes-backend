import { products_units } from "#/client";
import { repository } from "@/config/prisma";
import { ProductsService } from "@/products/products.service";

export class ProductsUnitsService {
  constructor(private productsService: ProductsService) {}

  create = async (
    product_id: string,
    unit: Omit<products_units, "id" | "product_id">,
  ) => {
    try {
      const result = await repository.products_units.create({
        data: {
          product_id,
          ...unit,
        },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating product unit");
    }
  };

  delete = async (product_id: string, id: string) => {
    try {
      await repository.products_units.delete({
        where: {
          product_id,
          id,
        },
      });
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting product unit");
    }
  };

  getAll = async (product_id: string | string[]) => {
    try {
      const productIDIsArray = Array.isArray(product_id);
      if (productIDIsArray) {
        const result = await repository.products_units.findMany({
          where: {
            product_id: {
              in: product_id,
            },
          },
        });
        return result;
      } else {
        const result = await repository.products_units.findMany({
          where: {
            product_id: product_id,
          },
        });
        return result;
      }
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting product units: ");
    }
  };

  getOne = async (product_id: string, id: string) => {
    try {
      const result = await repository.products_units.findUnique({
        where: {
          id,
          product_id,
        },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting product unit");
    }
  };

  update = async (
    product_id: string,
    id: string,
    unit: Partial<Omit<products_units, "id" | "product_id">>,
  ) => {
    try {
      const productExist = await this.productsService.getOne(product_id);

      if (!productExist) {
        throw new Error("Product not found");
      }

      const existingUnitResult = await this.getOne(product_id, id);

      if (!existingUnitResult) {
        throw new Error("Product unit not found");
      }

      const updateProductUnit = { ...existingUnitResult, ...unit };

      const result = await repository.products_units.update({
        data: updateProductUnit,
        where: {
          id,
          product_id,
        },
      });
      return result
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating product unit");
    }
  };
}
