import { Pool } from "pg";
import { Client } from "./models/Client";

export class ClientsService {
  constructor(private repository: Pool) {}

  getAll = async (): Promise<Client[]> => {
    try {
      const result = await this.repository.query(
        `SELECT * FROM public.clients`,
      );
      return result.rows;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting Clients");
    }
  };
  getOne = async (id: number): Promise<Client | null> => {
    try {
      const result = await this.repository.query(
        `SELECT * FROM public.clients WHERE id = $1::numeric`,
        [id],
      );
      if (result.rows.length <= 0) {
        return null;
      }
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error getting Client");
    }
  };
  create = async (client: Omit<Client, "id">): Promise<Client> => {
    try {
      const result = await this.repository.query(
        `INSERT INTO public.clients (code, description, client_id, email, phone, country, city, address, credit_days, credit_limit, discount) VALUES($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text, $8::text, $9::numeric, $10::numeric, $11::numeric) RETURNING *`,
        [
          client.code,
          client.description,
          client.client_id,
          client.email,
          client.phone,
          client.country,
          client.city,
          client.address,
          client.credit_days,
          client.credit_limit,
          client.discount,
        ],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error creating Client");
    }
  };
  update = async (
    id: number,
    client: Partial<Omit<Client, "id">>,
  ): Promise<Client> => {
    try {
      const existingClient = await this.getOne(id);
      if (!existingClient) {
        throw new Error("Client not found");
      }
      const updatedClient = { ...existingClient, ...client };
      const result = await this.repository.query(
        `UPDATE public.clients SET code=$1::text, description=$2::text, client_id=$3::text, email=$4::text, phone=$5::text, country=$6::text, city=$7::text, address=$8::text, credit_days=$9::numeric, credit_limit=$10::numeric, discount=$11::numeric WHERE id=$12::numeric RETURNING *`,
        [
          updatedClient.code,
          updatedClient.description,
          updatedClient.client_id,
          updatedClient.email,
          updatedClient.phone,
          updatedClient.country,
          updatedClient.city,
          updatedClient.address,
          updatedClient.credit_days,
          updatedClient.credit_limit,
          updatedClient.discount,
          id,
        ],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error updating Client");
    }
  };
  delete = async (id: number): Promise<void> => {
    try {
      await this.repository.query(
        `DELETE FROM public.clients WHERE id=$1::numeric`,
        [id],
      );
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error deleting Client");
    }
  };
}
