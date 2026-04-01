import { Pool } from "pg";
import { User } from "@/users/models/User";

export class UsersService {
  constructor(private repository: Pool) {}

  getAll = async (): Promise<User[]> => {
    try {
      const result = await this.repository.query("SELECT * FROM users");
      return result.rows;
    } catch (error) {
      throw new Error("Error fetching users");
    }
  };

  getOne = async (code: string): Promise<User | null> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM users WHERE code = $1::text",
        [code],
      );
      if (result.rows.length <= 0) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      throw new Error("Error fetching user");
    }
  };
}
