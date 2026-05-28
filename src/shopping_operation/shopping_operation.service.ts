import { Pool } from "pg";

import { DateUtils } from "@/lib/date.utils";
import { ShoppingOperation } from "@/shopping_operation/models/ShoppingOperation";

export class ShoppingOperationService {
  constructor(private repository: Pool) {}

  calculateTotals = (
    details: {
      amount: number;
      total: number;
      total_net: number;
      total_tax: number;
    }[],
  ): {
    total: number;
    total_amount: number;
    total_net: number;
    total_tax: number;
  } => {
    const totals = {
      total: 0,
      total_amount: 0,
      total_net: 0,
      total_tax: 0,
    };

    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      totals.total_amount += detail.amount;
      totals.total_net += detail.total_net;
      totals.total_tax += detail.total_tax;
      totals.total += detail.total;
    }

    return totals;
  };

  create = async (
    shoppingOperation: Omit<ShoppingOperation, "emission_date" | "id">,
  ): Promise<ShoppingOperation> => {
    try {
      const emissionDate = DateUtils.getDateFormated(new Date());
      const result = await this.repository.query(
        `INSERT INTO shopping_operation (operation_type, document_no, emission_date, description, user_id, total_amount, total_net, total_tax, total, credit, cash, total_count_details, pending) VALUES($1::text, $2::text, $3::date, $4::text, $5::numeric, $6::numeric, $7::numeric, $8::numeric, $9::numeric, $10::numeric, $11::numeric, $12::numeric, $13::boolean) RETURNING *`,
        [
          shoppingOperation.operation_type,
          shoppingOperation.document_no,
          emissionDate,
          shoppingOperation.description,
          shoppingOperation.user_id,
          shoppingOperation.total_amount,
          shoppingOperation.total_net,
          shoppingOperation.total_tax,
          shoppingOperation.total,
          shoppingOperation.credit,
          shoppingOperation.cash,
          shoppingOperation.total_count_details,
          shoppingOperation.pending,
        ],
      );

      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating ShoppingOperation");
    }
  };

  getAll = async (): Promise<ShoppingOperation[]> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM shopping_operation",
      );

      return result.rows;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting ShoppingOperation");
    }
  };

  getDocumentNo = async (prefix?: string): Promise<string> => {
    try {
      const result = await this.repository.query(
        "SELECT last_value + 1 as num FROM shopping_operation_id_seq",
      );

      const lastNumber = String(result.rows[0].num);
      const documentNo = lastNumber.padStart(8, "0");

      if (prefix) {
        return prefix + documentNo;
      }

      return documentNo;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting numeration ShoppingOperation");
    }
  };

  getOne = async (id: number): Promise<null | ShoppingOperation> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM shopping_operation WHERE id = $1::numeric",
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
      throw new Error("Error getting ShoppingOperation");
    }
  };
}
