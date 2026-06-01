import { Pool } from "pg";

import { Product } from "@/products/models/Product";

export class ProductsService {
  constructor(private repository: Pool) { }

  create = async (product: Omit<Product, "id">): Promise<Product> => {
    try {
      const result = await this.repository.query(
        `
        INSERT INTO public.products (code, description, mark, model, referenc, discount, status, origin, buy_tax, sale_tax) VALUES($1::text, $2::text, $3::text, $4::text, $5::text, $6::numeric, $7::boolean, $8::text, $9::numeric, $10::numeric) RETURNING *
        `,
        [
          product.code,
          product.description,
          product.mark,
          product.model,
          product.referenc,
          product.discount,
          product.status,
          product.origin,
          product.buy_tax,
          product.sale_tax,
        ],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating product");
    }
  };
  delete = async (id: number): Promise<void> => {
    try {
      const existingProduct = await this.getOne(id);
      if (!existingProduct) {
        throw new Error("Product not found");
      }
      await this.repository.query(
        "DELETE FROM products WHERE id = $1::numeric",
        [id],
      );
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting product");
    }
  };
  getAll = async (): Promise<Product[]> => {
    try {
      const result = await this.repository.query("SELECT * FROM products");
      return result.rows;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching products");
    }
  };

  getMarks = async (): Promise<string[]> => {
    try {
      const result = await this.repository.query(
        `
        SELECT mark FROM products GROUP BY mark ORDER BY mark ASC
        `,
      );
      return result.rows;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.messgae);
      }
      throw new Error("Error updating product");
    }
  }

  getOne = async (id: number): Promise<null | Product> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM products WHERE id = $1::numeric",
        [id],
      );
      if (result.rows.length <= 0) {
        return null;
      }
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching product");
    }
  };

  update = async (
    id: number,
    product: Partial<Omit<Product, "id">>,
  ): Promise<Product> => {
    try {
      // this is in use for getting last values and update only the requireds
      const existingProduct = await this.getOne(id);
      if (!existingProduct) {
        throw new Error("Product not found");
      }
      const updatedProduct = { ...existingProduct, ...product };
      const result = await this.repository.query(
        `
        UPDATE public.products SET code=$1::text, description=$2::text, mark=$3::text, model=$4::text, referenc=$5::text, discount=$6::numeric, status=$7::boolean, origin=$8::text, buy_tax=$9::numeric, sale_tax=$10::numeric WHERE id=$11::numeric RETURNING *
        `,
        [
          updatedProduct.code,
          updatedProduct.description,
          updatedProduct.mark,
          updatedProduct.model,
          updatedProduct.referenc,
          updatedProduct.discount,
          updatedProduct.status,
          updatedProduct.origin,
          updatedProduct.buy_tax,
          updatedProduct.sale_tax,
          id,
        ],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating product");
    }
  };
  updateImageUrl = async (id: number, image_url?: string) => {
    try {
      const result = await this.repository.query(
        `
        UPDATE public.products SET image_url=$1::text WHERE id=$2::numeric RETURNING *
        `,
        [
          image_url,
          id,
        ],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating product");
    }
  }

}
