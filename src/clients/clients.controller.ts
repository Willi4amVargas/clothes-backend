import { ClientsService } from "@/clients/clients.service";
import { Request, Response } from "express";
import { CreateClientDto } from "@/clients/dto/create-client.dto";
import { UpdateClientDto } from "@/clients/dto/update-client.dto";

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

  create = async (req: Request, res: Response) => {
    const createClientDtoParse = CreateClientDto.safeParse(req.body);

    if (!createClientDtoParse.success) {
      return res
        .status(400)
        .json({ message: createClientDtoParse.error?.issues });
    }
    const client = createClientDtoParse.data;

    try {
      const newClient = await this.clientsService.create(client);
      return res.status(201).json(newClient);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error creating client" });
    }
  };

  update = async (req: Request, res: Response) => {
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

    const updateClientDtoParse = UpdateClientDto.safeParse(req.body);

    if (!updateClientDtoParse.success) {
      return res
        .status(400)
        .json({ message: updateClientDtoParse.error?.issues });
    }
    const client = updateClientDtoParse.data;

    try {
      const result = await this.clientsService.update(+id, client);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error updating client" });
    }
  };

  delete = async (req: Request, res: Response) => {
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
      await this.clientsService.delete(+id);
      return res.status(200).json({ message: "Client deleted successfully" });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error deleting client" });
    }
  };
}
