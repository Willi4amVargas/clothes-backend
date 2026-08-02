import { products } from "#/client";
import { repository } from "@/config/prisma";

export class ProductsService {
  constructor() {}

  create = async (product: Omit<products, "id">) => {
    try {
      const result = await repository.products.create({
        data: product,
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating product");
    }
  };
  delete = async (id: string) => {
    try {
      await repository.products.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting product");
    }
  };
  getAll = async (ids?: string[]) => {
    try {
      const results = await repository.products.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      return results;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching products");
    }
  };

  getMarks = async () => {
    try {
      const result = await repository.marks.findMany({
        orderBy: {
          description: "asc",
        },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.messgae);
      }
      throw new Error("Error updating product");
    }
  };

  getOne = async (id: string) => {
    try {
      const result = await repository.products.findUnique({
        where: {
          id,
        },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching product");
    }
  };

  update = async (id: string, product: Partial<Omit<products, "id">>) => {
    try {
      // this is in use for getting last values and update only the requireds
      const existingProduct = await this.getOne(id);
      if (!existingProduct) {
        throw new Error("Product not found");
      }
      const updatedProduct = { ...existingProduct, ...product };
      const result = await repository.products.update({
        where: {
          id,
        },
        data: updatedProduct,
      });

      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating product");
    }
  };
  updateImageUrl = async (id: string, image_url?: string) => {
    try {
      const result = await repository.products.update({
        data: {
          image_url,
        },
        where: {
          id,
        },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating product");
    }
  };
}
