import { Pool } from "pg";

import { User } from "@/users/models/User";

export class UsersService {
  constructor(private repository: Pool) { }

  // this is not in use for now
  // getAll = async (): Promise<User[]> => {
  //   try {
  //     const result = await this.repository.query("SELECT * FROM users");
  //     return result.rows;
  //   } catch (error) {
  //     throw new Error("Error fetching users");
  //   }
  // };

  getOne = async (code: string): Promise<null | User> => {
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

  getOnebyId = async (id: number): Promise<null | User> => {
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

  setRecoveryCode = async (
    id: number,
    hashedCode: string,
    expiresAt: Date,
  ) => {
    try {
      await this.repository.query(
        "UPDATE public.users SET recovery_token=$1::text, recovery_token_expires_at=$2::timestamp WHERE id=$3::numeric",
        [hashedCode, expiresAt, id],
      );
    } catch (error: any) {
      throw new Error(error.message || "Error setting recovery code");
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
      const { password, ...updatedUserReturn } = result.rows[0]
      return updatedUserReturn
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching user");
    }
  }

  updatePassword = async (id: number, hashedPassword: string) => {
    try {
      await this.repository.query(
        "UPDATE public.users SET password=$1::text, recovery_token=NULL, recovery_token_expires_at=NULL WHERE id=$2::numeric",
        [hashedPassword, id],
      );
    } catch (error: any) {
      throw new Error(error.message || "Error updating password");
    }
  };
}
