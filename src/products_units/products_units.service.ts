import { Pool } from "pg";

import { ProductsService } from "@/products/products.service";
import { ProductUnit } from "@/products_units/models/ProductUnit";

export class ProductsUnitsService {
  constructor(
    private repository: Pool,
    private productsService: ProductsService,
  ) {}

  create = async (
    product_id: number,
    unit: Omit<ProductUnit, "id" | "product_id">,
  ): Promise<ProductUnit> => {
    try {
      const productExist = await this.productsService.getOne(product_id);

      if (!productExist) {
        throw new Error("Product not found");
      }

      const result = await this.repository.query(
        `
        INSERT INTO public.products_units (unit, product_id, cost, price) VALUES($1::text, $2::numeric, $3::numeric, $4::numeric) RETURNING *
        `,
        [unit.unit, product_id, unit.cost, unit.price],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating product unit");
    }
  };

  delete = async (product_id: number, id: number): Promise<void> => {
    try {
      await this.repository.query(
        "DELETE FROM products_units WHERE product_id = $1::numeric AND id = $2::numeric",
        [product_id, id],
      );
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting product unit");
    }
  };

  getAll = async (product_id: number | number[]): Promise<ProductUnit[]> => {
    const productIDIsArray = Array.isArray(product_id);
    let query = "SELECT * FROM products_units";
    if (productIDIsArray) {
      query += ` WHERE product_id IN (${product_id
        .map((_, index) => `\$${index + 1}::numeric`)
        .join(", ")})`;
    } else {
      query += ` WHERE product_id = $1::numeric`;
    }
    try {
      const result = await this.repository.query(
        query,
        productIDIsArray ? product_id : [product_id],
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
    product_id: number,
    id: number,
  ): Promise<null | ProductUnit> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM products_units WHERE product_id = $1::numeric AND id = $2::numeric",
        [product_id, id],
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

  update = async (
    product_id: number,
    id: number,
    unit: Partial<Omit<ProductUnit, "id" | "product_id">>,
  ): Promise<ProductUnit> => {
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

      const result = await this.repository.query(
        `
        UPDATE public.products_units SET unit=$1::text, cost=$2::numeric, price=$3::numeric WHERE id=$4::numeric AND product_id = $5::numeric RETURNING *
        `,
        //"UPDATE products_units SET unit = $1::text, main_unit = $2::boolean, cost = $3::numeric, price = $4::numeric WHERE product_code = $5::text AND correlative = $6::integer RETURNING *",
        [
          updateProductUnit.unit,
          updateProductUnit.cost,
          updateProductUnit.price,
          id,
          product_id,
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
}
