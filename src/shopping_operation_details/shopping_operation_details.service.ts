import { Pool } from "pg";
import { ShoppingOperationDetail } from "@/shopping_operation_details/models/ShoppingOperationDetail";

export class ShoppingOperationDetailsService {
  constructor(private repository: Pool) {}

  getAll = async (main_id: number): Promise<ShoppingOperationDetail[] | null> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM shopping_operation_details WHERE main_id = $1::numeric",
        [main_id],
      );

      if (result.rows.length <= 0) {
        return null;
      }

      return result.rows;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting ShoppingOperationDetails");
    }
  };

  getOne = async (
    main_id: number,
    line: number,
  ): Promise<ShoppingOperationDetail | null> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM shopping_operation_details WHERE main_id = $1::numeric AND line = $2::numeric",
        [main_id, line],
      );

      if (result.rows.length <= 0) {
        return null;
      }

      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting ShoppingOperationDetail");
    }
  };

  create = async (
    main_id: number,
    shoppingOperationDetail: Omit<ShoppingOperationDetail, "main_id" | "line">,
  ): Promise<ShoppingOperationDetail> => {
    try {
      const result = await this.repository.query(
        `INSERT INTO shopping_operation_details (main_id, product_id, description_product, amount, unit, unitary_cost, buy_aliquot, total_net, total_tax, total) VALUES($1::numeric, $2::numeric, $3::text, $4::numeric, $5::numeric, $6::numeric, $7::numeric, $8::numeric, $9::numeric, $10::numeric) RETURNING *`,
        [
          main_id,
          shoppingOperationDetail.product_id,
          shoppingOperationDetail.description_product,
          shoppingOperationDetail.amount,
          shoppingOperationDetail.unit,
          shoppingOperationDetail.unitary_cost,
          shoppingOperationDetail.buy_aliquot,
          shoppingOperationDetail.total_net,
          shoppingOperationDetail.total_tax,
          shoppingOperationDetail.total,
        ],
      );

      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating ShoppingOperationDetail");
    }
  };

  calculateTotals = (
    unitary_cost: number,
    amount: number,
    buy_aliquot: number,
  ): {
    total_net: number;
    total_tax: number;
    total: number;
  } => {
    const total_net = unitary_cost * amount;
    const total_tax = (total_net * buy_aliquot) / 100;
    const total = total_net + total_tax;

    return { total_net, total_tax, total };
  };
}
