import { Pool } from "pg";
import { ProductUnit } from "@/products_units/models/ProductUnit";
import { ProductsService } from "@/products/products.service";

export class ProductsUnitsService {
  constructor(
    private repository: Pool,
    private productsService: ProductsService,
  ) {}

  getAll = async (product_code: string): Promise<ProductUnit[]> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM products_units WHERE product_code = $1::text",
        [product_code],
      );
      return result.rows;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting product units: ");
    }
  };

  getOne = async (
    product_code: string,
    correlative: number,
  ): Promise<ProductUnit | null> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM products_units WHERE product_code = $1::text AND correlative = $2::integer",
        [product_code, correlative],
      );
      if (result.rows.length <= 0) {
        return null;
      }

      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting product unit");
    }
  };

  create = async (
    product_code: string,
    unit: Omit<ProductUnit, "correlative" | "product_code">,
  ): Promise<ProductUnit> => {
    try {
      const productExist = await this.productsService.getOne(product_code);

      if (!productExist) {
        throw new Error("Product not found");
      }

      const result = await this.repository.query(
        "INSERT INTO products_units (product_code, unit, main_unit, cost, price) VALUES ($1::text, $2::text, $3::boolean, $4::numeric, $5::numeric) RETURNING *",
        [product_code, unit.unit, unit.main_unit, unit.cost, unit.price],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating product unit");
    }
  };

  update = async (
    product_code: string,
    correlative: number,
    unit: Partial<Omit<ProductUnit, "correlative" | "product_code">>,
  ): Promise<ProductUnit> => {
    try {
      const productExist = await this.productsService.getOne(product_code);

      if (!productExist) {
        throw new Error("Product not found");
      }

      const existingUnitResult = await this.getOne(product_code, correlative);

      if (!existingUnitResult) {
        throw new Error("Product unit not found");
      }

      const updateProductUnit = { ...existingUnitResult, ...unit };

      const result = await this.repository.query(
        "UPDATE products_units SET unit = $1::text, main_unit = $2::boolean, cost = $3::numeric, price = $4::numeric WHERE product_code = $5::text AND correlative = $6::integer RETURNING *",
        [
          updateProductUnit.unit,
          updateProductUnit.main_unit,
          updateProductUnit.cost,
          updateProductUnit.price,
          product_code,
          correlative,
        ],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating product unit");
    }
  };

  delete = async (product_code: string, correlative: number): Promise<void> => {
    try {
      await this.repository.query(
        "DELETE FROM products_units WHERE product_code = $1::text AND correlative = $2::integer",
        [product_code, correlative],
      );
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting product unit");
    }
  };
}
