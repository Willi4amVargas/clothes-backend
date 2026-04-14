import { Request, Response } from "express";
import { SalesOperationService } from "@/sales_operation/sales_operation.service";
import { CreateSalesOperationDto } from "./dto/create-sales-operation.dto";

export class SalesOperationController {
  constructor(private salesOperationService: SalesOperationService) {}
  getAll = async (_: Request, res: Response) => {
    try {
      const salesOperations = await this.salesOperationService.getAll();
      return res.json(salesOperations);
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error getting SalesOperations" });
    }
  };

  getOne = async (req: Request, res: Response) => {
    const { correlative } = req.params;
    if (!correlative || typeof correlative !== "string") {
      res.status(400).json({ message: "Invalid correlative number" });
      return;
    }

    if (Number.isNaN(+correlative)) {
      res.status(400).json({ message: "Correlative is not a number" });
      return;
    }

    if (+correlative <= 0) {
      res
        .status(400)
        .json({ message: "Correlative can't be less or equal to 0" });
      return;
    }
    try {
      const salesOperation =
        await this.salesOperationService.getOne(+correlative);
      if (!salesOperation) {
        return res.json({ message: "Sales operation dont exist" });
      }
      return res.json(salesOperation);
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error getting SalesOperation" });
    }
  };

  create = async (req: Request, res: Response) => {
    const salesOperationDtoParse = CreateSalesOperationDto.safeParse(req.body);

    if (!salesOperationDtoParse.success) {
      return res
        .status(400)
        .json({ message: salesOperationDtoParse.error?.issues });
    }

    const salesOperation = salesOperationDtoParse.data;
    try {
      return res.json(salesOperation);
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error creating SalesOperation" });
    }
  };
}
