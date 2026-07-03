import { Pool } from "pg";

import { ClientSales } from "./models/client_sales.model";

interface GetClientSalesParams {
  clientId: number;
}

export class ReportsService {
  constructor(private repository: Pool) {}

  getClientSales = async ({
    clientId,
  }: GetClientSalesParams): Promise<ClientSales[] | null> => {
    try {
      const result = await this.repository.query(
        "select * from sales_operation so where so.client_id = $1::numeric",
        [clientId],
      );
      if (result.rows.length <= 0) {
        return null;
      }
      return result.rows;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating InventoryOperation");
    }
  };
}
