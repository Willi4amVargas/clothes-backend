import { clients } from "#/client";
import { repository } from "@/config/prisma";

export class ClientsService {
  constructor() { }

  create = async (client: Omit<clients, "id">) => {
    try {
      const result = await repository.clients.create({
        data: { ...client }
      })
      return result
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating Client");
    }
  };
  delete = async (id: string) => {
    try {
      await repository.clients.delete({
        where: {
          id
        }
      })
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting Client");
    }
  };
  getAll = async () => {
    try {
      const result = await repository.clients.findMany()
      return result
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting Clients");
    }
  };
  getOne = async (id: string) => {
    try {
      const result = await repository.clients.findUnique({
        where: {
          id
        }
      })
      return result
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting Client");
    }
  };
  update = async (
    id: string,
    client: Partial<Omit<clients, "id">>,
  ) => {
    try {
      const existingClient = await this.getOne(id);
      if (!existingClient) {
        throw new Error("Client not found");
      }
      const updatedClient = { ...existingClient, ...client };
      const result = await repository.clients.update({
        data: {
          ...updatedClient
        },
        where: {
          id
        }
      })
      return result
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating Client");
    }
  };
}
