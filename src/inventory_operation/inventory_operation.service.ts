import { inventory_operation, module_types } from "#/client";
import { repository } from "@/config/prisma";
import { DateUtils } from "@/lib/date.utils";
import { NumerationService } from "@/numeration/numeration.service";

export class InventoryOperationService {
  constructor(private numerationService: NumerationService) {}

  calculateTotals = ({
    details,
  }: {
    details: {
      amount: number;
      total: number;
      total_cost: number;
      total_tax: number;
    }[];
  }): {
    total: number;
    total_amount: number;
    total_details: number;
    total_net: number;
    total_tax: number;
  } => {
    const result = {
      total: 0,
      total_amount: 0,
      total_details: details.length,
      total_net: 0,
      total_tax: 0,
    };

    for (const iod of details) {
      result.total += iod.total;
      result.total_net += iod.total_cost;
      result.total_tax += iod.total_tax;
      result.total_amount += iod.amount;
    }

    return result;
  };
  create = async (
    inventoryOperation: Omit<inventory_operation, "emission_date" | "id">,
  ) => {
    try {
      const emissionDate = DateUtils.getDateFormated(new Date());
      const result = await repository.inventory_operation.create({
        data: { ...inventoryOperation, emission_date: emissionDate },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating InventoryOperation");
    }
  };

  delete = async (id: string) => {
    try {
      await repository.inventory_operation.delete({
        where: {
          id,
        },
      });
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting InventoryOperation");
    }
  };

  getAll = async () => {
    try {
      const result = await repository.inventory_operation.findMany();
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting InventoryOperations");
    }
  };

  getDocumentNo = async (type: module_types) => {
    try {
      const result = await this.numerationService.getByModuleAndType(
        "INVENTORY_OPERATION",
        type,
      );

      const lastNumber = String(result.last_numeration);

      const documentNo = lastNumber.padStart(8, "0");

      if (result.prefix !== "") {
        return result.prefix + documentNo;
      }
      return documentNo;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting numeration InventoryOperation");
    }
  };

  getOne = async (id: string) => {
    try {
      const result = await repository.inventory_operation.findFirst({
        where: { id },
      });
      return result;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting InventoryOperation");
    }
  };
}
