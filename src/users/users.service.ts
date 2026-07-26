import { Pool } from "pg";

import { User } from "@/users/models/User";
import { hashPassword } from "@/lib/hash.utils";

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

  getBasicInfo = async (
    id: number
  ): Promise<null | Omit<User, | "email" | "password" | "recovery_token" | "recovery_token_expires_at" | "status">> => {
    const user = await this.repository.query(
      "SELECT code, p.description as profile, u.description FROM public.users u INNER JOIN profile p ON p.id = u.profile where u.id = $1::numeric",
      [id],
    );
    if (user.rows.length <= 0) {
      return null;
    }
    return user.rows[0];
  };

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

  getOnebyId = async (id: number): Promise<null | Omit<User, | "email" | "password" | "recovery_token" | "recovery_token_expires_at">> => {
    try {
      const result = await this.repository.query(
        "SELECT code, p.description as profile, u.description, u.status FROM public.users u INNER JOIN profile p ON p.id = u.profile where u.id = $1::numeric",
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

  setRecoveryCode = async (id: number, hashedCode: string, expiresAt: Date) => {
    try {
      await this.repository.query(
        "UPDATE public.users SET recovery_token=$1::text, recovery_token_expires_at=$2::timestamp WHERE id=$3::numeric",
        [hashedCode, expiresAt, id],
      );
    } catch (error: any) {
      throw new Error(error.message ?? "Error setting recovery code");
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
      const { password, ...updatedUserReturn } = result.rows[0];
      return updatedUserReturn;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching user");
    }
  };

  updatePassword = async (id: number, hashedPassword: string) => {
    try {
      await this.repository.query(
        "UPDATE public.users SET password=$1::text, recovery_token=NULL, recovery_token_expires_at=NULL WHERE id=$2::numeric",
        [hashedPassword, id],
      );
    } catch (error: any) {
      throw new Error(error.message ?? "Error updating password");
    }
  };

  create = async (user: Omit<User, "id" | "recovery_token" | "recovery_token_expires_at" | "status">): Promise<Omit<User, "password">> => {
    try {
      const codeExist = await this.getOne(user.code)
      if (codeExist) {
        throw new Error("User with this code already exist");
      }

      const hasPassword = hashPassword(user.password)

      const data = await this.repository.query("INSERT INTO public.users (profile, code, password, description, email, status) VALUES($1::numeric, $2::text, $3::text, $4::text, $5::text, true) RETURNING *",
        [
          user.profile,
          user.code,
          hasPassword,
          user.description,
          user.email
        ]
      )

      const { password, ...userInfo } = data.rows[0]

      return userInfo
    } catch (error: any) {
      throw new Error(error.message ?? "Error creating user");
    }
  }
}
