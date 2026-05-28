import { Request, Response } from "express";

import { ClientsService } from "@/clients/clients.service";
import { CreateClientDto } from "@/clients/dto/create-client.dto";
import { UpdateClientDto } from "@/clients/dto/update-client.dto";

export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  create = async (req: Request, res: Response) => {
    const isDryRun = res.locals.dry_run;
    const createClientDtoParse = CreateClientDto.safeParse(req.body);

    if (!createClientDtoParse.success) {
      return res
        .status(400)
        .json({ message: createClientDtoParse.error?.issues });
    }
    const client = createClientDtoParse.data;

    try {
      if (isDryRun) {
        return res.status(201).json({
          ...client,
          dry_run: true,
          id: 0,
          message:
            "Dry run enabled: request validated and simulated without persisting changes",
        });
      }
      const newClient = await this.clientsService.create(client);
      return res.status(201).json(newClient);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error creating client" });
    }
  };

  delete = async (req: Request, res: Response) => {
    const isDryRun = res.locals.dry_run;
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
      if (isDryRun) {
        const existingClient = await this.clientsService.getOne(+id);
        if (!existingClient) {
          return res.status(404).json({ message: "Client not found" });
        }
        return res.status(200).json({
          dry_run: true,
          message:
            "Dry run enabled: delete validated and simulated without persisting changes",
        });
      }
      await this.clientsService.delete(+id);
      return res.status(200).json({ message: "Client deleted successfully" });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error deleting client" });
    }
  };

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

  update = async (req: Request, res: Response) => {
    const isDryRun = res.locals.dry_run;
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
      if (isDryRun) {
        const existingClient = await this.clientsService.getOne(+id);
        if (!existingClient) {
          return res.status(404).json({ message: "Client not found" });
        }
        return res.status(200).json({
          ...existingClient,
          ...client,
          dry_run: true,
          message:
            "Dry run enabled: request validated and simulated without persisting changes",
        });
      }
      const result = await this.clientsService.update(+id, client);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error updating client" });
    }
  };
}
