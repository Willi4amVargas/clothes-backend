import { Pool } from "pg";
import { Profile } from "@/profile/models/Profile";

export class ProfileService {
  constructor(private repository: Pool) {}

  getAll = async (): Promise<Profile[]> => {
    try {
      const result = await this.repository.query("SELECT * FROM profiles");
      return result.rows;
    } catch (error) {
      throw new Error("Error fetching profiles");
    }
  };

  getOne = async (code: string): Promise<Profile | null> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM profiles WHERE code = $1::text",
        [code],
      );
      if (result.rows.length <= 0) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      throw new Error("Error fetching profile");
    }
  };
}
