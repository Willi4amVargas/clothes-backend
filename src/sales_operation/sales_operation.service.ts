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
        `INSERT INTO public.sales_operation (operation_type, document_no, emission_date, client_id, seller, credit_days, description, user_id, total_amount, percent_discount, discount, total_net, total_exempt, total_tax, total, credit, cash, total_net_cost, total_tax_cost, total_cost, total_count_details, pending) VALUES($1::text, $2::text, $3::text, $4::numeric, $5::text, $6::numeric, $7::text, $8::numeric, $9::numeric, $10::numeric, $11::numeric, $12::numeric, $13::numeric, $14::numeric, $15::numeric, $16::numeric, $17::numeric, $18::numeric, $19::numeric, $20::numeric, $21::numeric, $22::boolean) RETURNING *`,
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
}
