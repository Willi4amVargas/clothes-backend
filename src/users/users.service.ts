import { Pool } from "pg";
import { User } from "@/users/models/User";

export class UsersService {
  constructor(private repository: Pool) {}

  // this is not in use for now
  // getAll = async (): Promise<User[]> => {
  //   try {
  //     const result = await this.repository.query("SELECT * FROM users");
  //     return result.rows;
  //   } catch (error) {
  //     throw new Error("Error fetching users");
  //   }
  // };

  getOnebyId = async (id: number): Promise<User | null> => {
    try {
      const result = await this.repository.query(
        "SELECT * FROM users WHERE id = $1::numeric",
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
      throw new Error("Error fetching user");
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
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching user");
    }
  };

  update = async (id: number, user: Partial<Omit<User, "id">>) => {
    try {
      const existingUser = await this.getOnebyId(id);
      if (!existingUser) {
        throw new Error("User not found");
      }
      const updatedUser = { ...existingUser, ...user };
      const result = await this.repository.query(
        "UPDATE public.users SET profile=$1::numeric, code=$2::text, password=$3::text, description=$4::text, email=$5::text, status=$6::boolean WHERE id=$7::numeric RETURNING *",
        [
          updatedUser.profile,
          updatedUser.code,
          updatedUser.password,
          updatedUser.description,
          updatedUser.email,
          updatedUser.status,
          id,
        ],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching user");
    }
  };
}
