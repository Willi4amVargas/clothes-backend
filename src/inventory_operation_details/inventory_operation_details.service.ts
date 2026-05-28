import { Pool } from "pg";

import { InventoryOperationDetails } from "@/inventory_operation_details/models/InventoryOperationDetails";

export class InventoryOperationDetailsService {
  constructor(private repository: Pool) {}

  calculateTotals = ({
    aliquot,
    amount,
    unitary_cost,
  }: {
    aliquot: number;
    amount: number;
    unitary_cost: number;
  }): {
    total: number;
    total_cost: number;
    total_tax: number;
  } => {
    const total_cost = unitary_cost * amount;
    const total_tax = unitary_cost * (aliquot / 100) * amount;
    const total = total_cost + total_tax;

    return { total, total_cost, total_tax };
  };

  create = async (
    main_id: number,
    inventoryOperationDetail: Omit<
      InventoryOperationDetails,
      "line" | "main_id"
    >,
  ): Promise<InventoryOperationDetailsService> => {
    try {
      const result = await this.repository.query(
        `
        INSERT INTO inventory_operation_details (main_id, product_id, description_product, amount, unit, unitary_cost, aliquot, total_cost, total_tax, total) VALUES($1::numeric, $2::numeric, $3::text, $4::numeric, $5::numeric, $6::numeric, $7::numeric, $8::numeric, $9::numeric, $10::numeric) RETURNING *
        `,
        [
          main_id,
          inventoryOperationDetail.product_id,
          inventoryOperationDetail.description_product,
          inventoryOperationDetail.amount,
          inventoryOperationDetail.unit,
          inventoryOperationDetail.unitary_cost,
          inventoryOperationDetail.aliquot,
          inventoryOperationDetail.total_cost,
          inventoryOperationDetail.total_tax,
          inventoryOperationDetail.total,
        ],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating InventoryOperationDetails");
    }
  };

  delete = async (main_id: number, line: number): Promise<void> => {
    try {
      await this.repository.query(
        "DELETE FROM public.inventory_operation_details WHERE main_id=$1::numeric AND line=$2::numeric",
        [main_id, line],
      );
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting InventoryOperationDetails");
    }
  };
  // this is not in use for now
  // update = async (
  //   main_correlative: number,
  //   line: number,
  //   inventoryOperationDetail: Partial<
  //     Omit<InventoryOperationDetails, "main_correlative" | "line">
  //   >,
  // ): Promise<InventoryOperationDetails> => {
  //   try {
  //     const existingInventoryOperationDetail = await this.getOne(
  //       main_correlative,
  //       line,
  //     );

  //     if (!existingInventoryOperationDetail)
  //       throw new Error("Inventory operation detail dont exist");

  //     const updateInventoryOperationDetail = {
  //       ...existingInventoryOperationDetail,
  //       ...inventoryOperationDetail,
  //     };

  //     const result = await this.repository.query(
  //       "UPDATE public.inventory_operation_details SET code_product=$1::text, description_product=$2::text, referenc=$3::text, mark=$4::text, model=$5::text, amount=$6::numeric, unit=$7::numeric, unitary_cost=$8::numeric, aliquot=$9::numeric, total_cost=$10::numeric, total_tax=$11::numeric, total=$12::numeric WHERE main_correlative=$13::numeric AND line=$14::numeric RETURNING *",
  //       [
  //         updateInventoryOperationDetail.code_product,
  //         updateInventoryOperationDetail.description_product,
  //         updateInventoryOperationDetail.referenc,
  //         updateInventoryOperationDetail.mark,
  //         updateInventoryOperationDetail.model,
  //         updateInventoryOperationDetail.amount,
  //         updateInventoryOperationDetail.unit,
  //         updateInventoryOperationDetail.unitary_cost,
  //         updateInventoryOperationDetail.aliquot,
  //         updateInventoryOperationDetail.total_cost,
  //         updateInventoryOperationDetail.total_tax,
  //         updateInventoryOperationDetail.total,
  //         main_correlative,
  //         line,
  //       ],
  //     );
  //     return result.rows[0];
  //   } catch (error: any) {
  //     if (error.message) {
  //       throw new Error(error.message);
  //     }
  //     throw new Error("Error updating InventoryOperationDetails");
  //   }
  // };

  getAll = async (
    main_id: number,
  ): Promise<InventoryOperationDetails[] | null> => {
    try {
      const result = await this.repository.query(
        "SELECT *  FROM inventory_operation_details WHERE main_id = $1::numeric",
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
      throw new Error("Error getting InventoryOperationDetails");
    }
  };

  getOne = async (
    main_id: number,
    line: number,
  ): Promise<InventoryOperationDetails | null> => {
    try {
      const result = await this.repository.query(
        "SELECT *  FROM inventory_operation_details WHERE main_id = $1::numeric AND line=$2::numeric",
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
      throw new Error("Error getting InventoryOperationDetail");
    }
  };
}
