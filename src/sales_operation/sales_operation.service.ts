import { Pool } from "pg";
import { SalesOperation } from "@/sales_operation/models/SalesOperation";
import { DateUtils } from "@/lib/date.utils";

export class SalesOperationService {
  constructor(private repository: Pool) {}

  getAll = async (): Promise<SalesOperation[]> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM sales_operation",
      );

      return result.rows;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting SalesOperation");
    }
  };

  getOne = async (id: number): Promise<SalesOperation | null> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM sales_operation WHERE id = $1::numeric",
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
      throw new Error("Error getting SalesOperation");
    }
  };

  create = async (
    sales_operation: Omit<SalesOperation, "id" | "emission_date">,
  ): Promise<SalesOperation> => {
    try {
      const actualDate = new Date();
      const emission_date = DateUtils.getDateFormated(actualDate);
      const result = await this.repository.query(
        `INSERT INTO public.sales_operation (operation_type, document_no, emission_date, client_id, seller, credit_days, description, user_id, total_amount, percent_discount, discount, total_net, total_exempt, total_tax, total, credit, cash, total_net_cost, total_tax_cost, total_cost, total_count_details, pending) VALUES($1, $2::text, $3, $4::numeric, $5::text, $6::numeric, $7::text, $8::numeric, $9::numeric, $10::numeric, $11::numeric, $12::numeric, $13::numeric, $14::numeric, $15::numeric, $16::numeric, $17::numeric, $18::numeric, $19::numeric, $20::numeric, $21::numeric, $22::boolean) RETURNING *`,
        [
          sales_operation.operation_type,
          sales_operation.document_no,
          emission_date,
          sales_operation.client_id,
          sales_operation.seller,
          sales_operation.credit_days,
          sales_operation.description,
          sales_operation.user_id,
          sales_operation.total_amount,
          sales_operation.percent_discount,
          sales_operation.discount,
          sales_operation.total_net,
          sales_operation.total_exempt,
          sales_operation.total_tax,
          sales_operation.total,
          sales_operation.credit,
          sales_operation.cash,
          sales_operation.total_net_cost,
          sales_operation.total_tax_cost,
          sales_operation.total_cost,
          sales_operation.total_count_details,
          sales_operation.pending,
        ],
      );

      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating SalesOperation");
    }
  };

  calculateCostTotals = (
    details_cost_totals: {
      total_net_cost: number;
      total_tax_cost: number;
      total_cost: number;
    }[],
  ): {
    total_net_cost: number;
    total_tax_cost: number;
    total_cost: number;
  } => {
    const totalsCost = {
      total_net_cost: 0,
      total_tax_cost: 0,
      total_cost: 0,
    };

    for (let i = 0; i < details_cost_totals.length; i++) {
      const detail_cost_totals = details_cost_totals[i];
      totalsCost.total_net_cost += detail_cost_totals.total_net_cost;
      totalsCost.total_tax_cost += detail_cost_totals.total_tax_cost;
      totalsCost.total_cost += detail_cost_totals.total_cost;
    }
    return totalsCost;
  };

  calculateTotals = (
    percent_discount: number,
    details_totals: {
      discount: number;
      total_net: number;
      total_tax: number;
      total: number;
    }[],
  ): {
    discount: number;
    total_net: number;
    total_exempt: number;
    total_tax: number;
    total: number;
  } => {
    const totals = {
      discount: 0,
      total_net: 0,
      total_exempt: 0,
      total_tax: 0,
      total: 0,
    };

    for (let i = 0; i < details_totals.length; i++) {
      const detail_totals = details_totals[i];
      totals.total_net += detail_totals.total_net;
      totals.total_tax += detail_totals.total_tax;
      // for now we do this, later we can add a property o do in other way
      if (detail_totals.total_tax == 0) {
        totals.total_exempt += detail_totals.total_net;
      }
      totals.total += detail_totals.total;
    }
    // for now is not posible add discount to the general sale
    // totals.discount = (totals.total_net * percent_discount) / 100;
    return totals;
  };

  // this can be in a table with all numeration
  getDocumentNo = async (prefix?: string): Promise<string> => {
    try {
      const result = await this.repository.query(
        "SELECT last_value + 1 as num FROM sales_operation_id_seq",
      );
      const lastNumber = String(result.rows[0].num)
      const documentNo = lastNumber.padStart(8, "0");

      if (prefix) {
        return prefix + documentNo;
      }
      return documentNo;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting numeration SalesOperation");
    }
  };
}
