import { Pool } from "pg";
import { Product } from "@/products/models/Product";

export class ProductsService {
  constructor(private repository: Pool) {}

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
  getOne = async (code: string): Promise<Product | null> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM products WHERE code = $1::text",
        [code],
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
  create = async (product: Product): Promise<Product> => {
    try {
      const result = await this.repository.query(
        `INSERT INTO products (code, description, short_name, mark, model, referenc, discount, status, origin, buy_tax, sale_tax) 
         VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::numeric, $8::boolean, $9::text, $10::numeric, $11::numeric)
         RETURNING *`,
        [
          product.code,
          product.description,
          product.short_name,
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

  update = async (
    code: string,
    product: Partial<Omit<Product, "code">>,
  ): Promise<Product> => {
    try {
      const existingProduct = await this.getOne(code);
      if (!existingProduct) {
        throw new Error("Product not found");
      }
      const updatedProduct = { ...existingProduct, ...product };
      const result = await this.repository.query(
        `UPDATE products SET description = $1::text, short_name = $2::text, mark = $3::text, model = $4::text, referenc = $5::text, discount = $6::numeric, status = $7::boolean, origin = $8::text, buy_tax = $9::numeric, sale_tax = $10::numeric
         WHERE code = $11::text RETURNING *`,
        [
          updatedProduct.description,
          updatedProduct.short_name,
          updatedProduct.mark,
          updatedProduct.model,
          updatedProduct.referenc,
          updatedProduct.discount,
          updatedProduct.status,
          updatedProduct.origin,
          updatedProduct.buy_tax,
          updatedProduct.sale_tax,
          code,
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

  delete = async (code: string): Promise<void> => {
    try {
      const existingProduct = await this.getOne(code);
      if (!existingProduct) {
        throw new Error("Product not found");
      }
      await this.repository.query(
        "DELETE FROM products WHERE code = $1::text",
        [code],
      );
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting product");
    }
  };
}
