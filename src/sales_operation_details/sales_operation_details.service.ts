import { Pool } from "pg";

import { SalesOperationDetail } from "@/sales_operation_details/models/SalesOperationDetail";

export class SalesOperationDetailsService {
  constructor(private repository: Pool) {}

  calculateCostTotals = (
    cost: number,
    amount: number,
    buy_aliquot: number,
  ): {
    total_cost: number;
    total_net_cost: number;
    total_tax_cost: number;
  } => {
    const total_net_cost = cost * amount;
    const total_tax_cost = (total_net_cost * buy_aliquot) / 100;
    const total_cost = total_net_cost + total_tax_cost;

    return { total_cost, total_net_cost, total_tax_cost };
  };

  calculateTotals = (
    price: number,
    percent_discount: number,
    amount: number,
    sale_aliquot: number,
  ): {
    discount: number;
    total: number;
    total_net: number;
    total_tax: number;
  } => {
    const subtotal = price * amount;
    const discount = (subtotal * percent_discount) / 100;
    const total_net = subtotal - discount;
    const total_tax = (total_net * sale_aliquot) / 100;
    const total = total_net + total_tax;
    return { discount, total, total_net, total_tax };
  };

  create = async (
    main_id: number,
    sales_operation_detail: Omit<SalesOperationDetail, "line" | "main_id">,
  ): Promise<SalesOperationDetail> => {
    try {
      const result = await this.repository.query(
        `INSERT INTO public.sales_operation_details (main_id, product_id, description_product, amount, unit, unitary_cost, sale_aliquot, buy_aliquot, price, total_net_cost, total_tax_cost, total_cost, percent_discount, discount, total_net, total_tax, total) VALUES($1::numeric, $2::numeric, $3::text, $4::numeric, $5::numeric, $6::numeric, $7::numeric, $8::numeric, $9::numeric, $10::numeric, $11::numeric, $12::numeric, $13::numeric, $14::numeric, $15::numeric, $16::numeric, $17::numeric) RETURNING *`,
        [
          main_id,
          sales_operation_detail.product_id,
          sales_operation_detail.description_product,
          sales_operation_detail.amount,
          sales_operation_detail.unit,
          sales_operation_detail.unitary_cost,
          sales_operation_detail.sale_aliquot,
          sales_operation_detail.buy_aliquot,
          sales_operation_detail.price,
          sales_operation_detail.total_net_cost,
          sales_operation_detail.total_tax_cost,
          sales_operation_detail.total_cost,
          sales_operation_detail.percent_discount,
          sales_operation_detail.discount,
          sales_operation_detail.total_net,
          sales_operation_detail.total_tax,
          sales_operation_detail.total,
        ],
      );

      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating SalesOperationDetail");
    }
  };

  getAll = async (main_id: number): Promise<SalesOperationDetail[]> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM sales_operation_details WHERE main_id = $1::numeric",
        [main_id],
      );
      return result.rows;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting SalesOperationDetails");
    }
  };

  getOne = async (
    main_id: number,
    line: number,
  ): Promise<null | SalesOperationDetail> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM sales_operation_details WHERE main_id = $1::numeric AND line = $2::numeric",
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
      throw new Error("Error getting SalesOperationDetail");
    }
  };
}
