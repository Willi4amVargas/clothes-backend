import { Pool } from "pg";
import { InventoryOperation } from "@/inventory_operation/models/InventoryOperation";
import { DateUtils } from "@/lib/date.utils";

export class InventoryOperationService {
  constructor(private repository: Pool) {}

  getAll = async (): Promise<InventoryOperation[]> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM inventory_operation",
      );
      return result.rows;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting InventoryOperations");
    }
  };
  getOne = async (correlative: number): Promise<InventoryOperation | null> => {
    try {
      const result = await this.repository.query(
        "SELECT *  FROM inventory_operation WHERE correlative = $1::numeric",
        [correlative],
      );
      if (result.rows.length <= 0) {
        return null;
      }
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting InventoryOperation");
    }
  };

  create = async (
    inventoryOperation: Omit<
      InventoryOperation,
      "correlative" | "emission_date"
    >,
  ): Promise<InventoryOperation> => {
    try {
      const emissionDate = DateUtils.getDateFormated(new Date());
      const result = await this.repository.query(
        "INSERT INTO inventory_operation (operation_type, document_no, emission_date, description, total, total_net, total_tax, user_code, total_details, total_amount) VALUES( $1::text, $2::text, $3::date, $4::text, $5::numeric, $6::numeric, $7::numeric, $8::text, $9::numeric, $10::numeric) RETURNING *",
        [
          inventoryOperation.operation_type,
          inventoryOperation.document_no,
          emissionDate,
          inventoryOperation.description,
          inventoryOperation.total,
          inventoryOperation.total_net,
          inventoryOperation.total_tax,
          inventoryOperation.user_code,
          inventoryOperation.total_details,
          inventoryOperation.total_amount,
        ],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating InventoryOperation");
    }
  };

  update = async (
    correlative: number,
    inventoryOperation: Partial<Omit<InventoryOperation, "correlative">>,
  ): Promise<InventoryOperation> => {
    try {
      const existingInventoryOperation = await this.getOne(correlative);

      if (!existingInventoryOperation)
        throw new Error("Inventory operation dont exist");

      const updateInventoryOperation = {
        ...existingInventoryOperation,
        ...inventoryOperation,
      };

      const result = await this.repository.query(
        "UPDATE inventory_operation SET operation_type=$1::text, document_no=$2::text, emission_date=$3::text, description=$4::text, total=$5::numeric,total_net=$6::numeric, total_tax=$7::numeric, user_code=$8::text, total_details=$9::numeric, total_amount=$10::numeric WHERE correlative=$11::numeric RETURNING *",
        [
          updateInventoryOperation.operation_type,
          updateInventoryOperation.document_no,
          updateInventoryOperation.emission_date,
          updateInventoryOperation.description,
          updateInventoryOperation.total,
          updateInventoryOperation.total_net,
          updateInventoryOperation.total_tax,
          updateInventoryOperation.user_code,
          updateInventoryOperation.total_details,
          updateInventoryOperation.total_amount,
          correlative,
        ],
      );

      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating InventoryOperation");
    }
  };

  delete = async (correlative: number): Promise<void> => {
    try {
      await this.repository.query(
        "DELETE FROM inventory_operation WHERE correlative=$1::numeric",
        [correlative],
      );
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting InventoryOperation");
    }
  };

  calculateTotals = ({
    details,
  }: {
    details: {
      total_cost: number;
      total_tax: number;
      total: number;
      amount: number;
    }[];
  }): {
    total: number;
    total_net: number;
    total_tax: number;
    total_details: number;
    total_amount: number;
  } => {
    const result = {
      total: 0,
      total_net: 0,
      total_tax: 0,
      total_details: details.length,
      total_amount: 0,
    };

    for (let i = 0; i < details.length; i++) {
      const iod = details[i];

      result.total += iod.total;
      result.total_net += iod.total_cost;
      result.total_tax += iod.total_tax;
      result.total_amount += iod.amount;
    }

    return result;
  };

  // this can be in a table with all numeration
  getDocumentNo = async (prefix?: string): Promise<string> => {
    try {
      const result = await this.repository.query(
        "SELECT last_value + 1 as num FROM inventory_operation_correlative_seq",
      );

      const documentNo = (result.rows[0].num as string).padStart(8, "0");

      if (prefix) {
        return prefix + documentNo;
      }
      return documentNo;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting numeration InventoryOperation");
    }
  };
}
