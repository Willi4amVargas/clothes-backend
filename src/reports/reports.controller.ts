import type { Request, Response } from "express";

import { ReportsService } from "./reports.service";

export class ReportsController {
  constructor(private reportsService: ReportsService) {}
  getClientSales = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      res.status(400).json({ message: "Invalid product code" });
      return;
    }

    if (Number.isNaN(+id)) {
      res.status(400).json({ message: "id is not a number" });
      return;
    }

    if (+id <= 0) {
      res.status(400).json({ message: "id can't be less or equal to 0" });
      return;
    }
    const clientSales = await this.reportsService.getClientSales({
      clientId: +id,
    });

    if (!clientSales) {
      return res.json({ message: "Not valid data for this client" });
    }
    return res.json(clientSales);
  };
}
