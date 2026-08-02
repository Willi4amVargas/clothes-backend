import { inventory_operation_details } from "#/client";
import { repository } from "@/config/prisma";

export class InventoryOperationDetailsService {
  constructor() {}

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
    main_id: string,
    inventoryOperationDetail: Omit<
      inventory_operation_details,
      "line" | "main_id"
    >,
  ) => {
    try {
      const result = await repository.inventory_operation_details.create({
        data: {
          main_id,
          ...inventoryOperationDetail,
        },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating InventoryOperationDetails");
    }
  };

  delete = async (main_id: string, line: string): Promise<void> => {
    try {
      await repository.inventory_operation_details.delete({
        where: {
          main_id,
          line,
        },
      });
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting InventoryOperationDetails");
    }
  };

  getAll = async (main_id: string) => {
    try {
      const result = await repository.inventory_operation_details.findMany({
        where: { main_id },
      });
      return result
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting InventoryOperationDetails");
    }
  };

  getOne = async (main_id: string, line: string) => {
    try {
      const result = await repository.inventory_operation_details.findFirst({
        where: {
          main_id,
          line,
        },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting InventoryOperationDetail");
    }
  };
}
