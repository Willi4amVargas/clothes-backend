import { ClientsService } from "@/clients/clients.service";
import { Request, Response } from "express";

export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  getAll = async (_: Request, res: Response) => {
    try {
      const clients = await this.clientsService.getAll();
      return res.json(clients);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error getting clients" });
    }
  };

  getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Id is not valid" });
    }

    if (Number.isNaN(+id)) {
      return res.status(400).json({ message: "id is not a number" });
    }

    if (+id <= 0) {
      return res
        .status(400)
        .json({ message: "id cant be equal or less than 0" });
    }
    try {
      const client = await this.clientsService.getOne(+id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      return res.json(client);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error getting clients" });
    }
  };
}
