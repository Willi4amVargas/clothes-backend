import { Pool } from "pg";
import { Product } from "@/products/models/Product";

export class ProductsService {
  constructor(private repository: Pool) {}

  getAll = async (): Promise<Product[]> => {
    try {
      const result = await this.repository.query("SELECT * FROM products");
      return result.rows;
    } catch (error) {
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
    } catch (error) {
      throw new Error("Error fetching product");
    }
  };
}
