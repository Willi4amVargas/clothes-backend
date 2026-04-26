import { Pool } from "pg";
import { ProductStock } from "@/products_stock/models/ProductStock";

export class ProductsStockService {
  constructor(private repository: Pool) {}

  getAll = async (product_id: number): Promise<ProductStock[]> => {
    try {
      const result = await this.repository.query(
        `SELECT * FROM products_stock WHERE product_id = $1::numeric`,
        [product_id],
      );
      return result.rows;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching products stock");
    }
  };

  getOne = async (
    product_id: number,
    unit: number,
  ): Promise<ProductStock | null> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM products_stock WHERE product_id = $1::numeric AND unit = $2::numeric",
        [product_id, unit],
      );
      if (result.rows.length <= 0) {
        return null;
      }
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching product stock");
    }
  };

  create = async (
    product_id: number,
    unit: number,
    productStock: Omit<ProductStock, "product_id" | "unit">,
  ): Promise<ProductStock> => {
    try {
      const result = await this.repository.query(
        "INSERT INTO products_stock (product_id, unit, stock) VALUES ($1::integer, $2::integer, $3::integer) RETURNING *",
        [product_id, unit, productStock.stock],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating product stock");
    }
  };

  update = async (
    product_id: number,
    unit: number,
    productStock: Partial<Omit<ProductStock, "product_id" | "unit">>,
    take_last?: boolean,
  ): Promise<ProductStock> => {
    try {
      const productStockExists = await this.getOne(product_id, unit);
      if (!productStockExists) {
        throw new Error("Product stock not found");
      }

      const updatedStock = { ...productStockExists, ...productStock };

      if (take_last && productStock.stock) {
        updatedStock.stock = productStockExists.stock + productStock.stock;
      }

      const result = await this.repository.query(
        `
        UPDATE public.products_stock SET stock=$1::numeric WHERE product_id=$2::numeric AND unit=$3::numeric RETURNING *
        `,
        //"UPDATE products_stock SET stock = $3::integer WHERE product_code = $1::text AND unit = $2::integer RETURNING *",
        [updatedStock.stock, product_id, unit],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating product stock");
    }
  };

  delete = async (product_id: number, unit: number): Promise<void> => {
    try {
      await this.repository.query(
        "DELETE FROM products_stock WHERE product_id = $1::numeric AND unit = $2::numeric",
        [product_id, unit],
      );
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting product stock");
    }
  };
}
