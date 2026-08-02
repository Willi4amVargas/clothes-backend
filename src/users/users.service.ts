import { Pool } from "pg";

import { hashPassword } from "@/lib/hash.utils";
import { repository } from "@/config/prisma";
import { users } from "#/client";

export class UsersService {
  constructor() { }

  getBasicInfo = async (
    id: string
  ) => {
    const user = await repository.users.findFirst({
      select: {
        id: true,
        code: true,
        description: true,
        profile: true
      },
      where: {
        id
      },
    })
    if (!user) {
      return null;
    }
    return user
  };

  /** 
  * Get one user by his code, return password
  * @param {string} code - Code of the user must be search
  * @return {Promise<null | users>} all users interface is returned
  */
  getOne = async (code: string) => {
    try {
      const result = await repository.users.findFirst({
        where: {
          code
        }
      })
      if (!result) {
        return null;
      }
      return result
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching user");
    }
  };
  /** 
  * Get one user by his ID
  * @param {string} id - Id of the user must be search
  * @return {Promise<null | users>} User interface
  */
  getOnebyId = async (id: string) => {
    try {
      const result = await repository.users.findUnique({
        where: {
          id
        },
        include: {
          profile: true
        }
      })
      if (!result) {
        return null;
      }
      return result
    } catch (error: any) {
      if (error.message) {
        console.log(error.message)
        throw new Error(error.message);
      }
      throw new Error("Error fetching user");
    }
  };

  setRecoveryCode = async (id: string, hashedCode: string, expiresAt: Date) => {
    try {
      await repository.users.update({
        data: {
          recovery_token: hashedCode,
          recovery_token_expires_at: expiresAt
        },
        where: {
          id
        }
      })
    } catch (error: any) {
      throw new Error(error.message ?? "Error setting recovery code");
    }
  };

  update = async (id: string, user: Partial<Omit<users, "id">>) => {
    try {
      const existingUser = await this.getOnebyId(id);
      if (!existingUser) {
        throw new Error("User not found");
      }
      const { profile, ...allOtherData } = existingUser
      const updatedUser = { ...allOtherData, ...user };
      const result = await repository.users.update({
        data: {
          ...updatedUser
        },
        where: {
          id
        }
      })
      const { password, recovery_token, recovery_token_expires_at, ...updatedUserReturn } = result
      return updatedUserReturn;
    } catch (error: any) {
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching user");
    }
  };

  updatePassword = async (id: string, hashedPassword: string) => {
    try {
      await repository.users.update({
        data: {
          password: hashedPassword,
          recovery_token: null,
          recovery_token_expires_at: null
        },
        where: {
          id
        }
      })
    } catch (error: any) {
      throw new Error(error.message ?? "Error updating password");
    }
  };

  create = async (user: Omit<users, "id" | "recovery_token" | "recovery_token_expires_at" | "status">) => {
    try {

      const hasPassword = hashPassword(user.password)

      const data = await repository.users.create({
        data: { ...user, password: hasPassword }
      })

      const { password, ...userInfo } = data

      return userInfo
    } catch (error: any) {
      throw new Error(error.message ?? "Error creating user");
    }
  }
}
