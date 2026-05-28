import { JWTPayload, jwtVerify, SignJWT } from "jose";

import { env } from "@/config/env";
import { verifyPassword } from "@/lib/hash.utils";
import { User } from "@/users/models/User";
import { UsersService } from "@/users/users.service";

interface UserPayload extends JWTPayload, User { }
export class AuthService {
  constructor(private usersService: UsersService) { }

  static verifyToken = async (token: string): Promise<UserPayload> => {
    try {
      const secret = new TextEncoder().encode(env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const user = payload as UserPayload;
      return user;
    } catch (error) {
      throw new Error("Invalid token");
    }
  };
  signIn = async (code: string, password: string): Promise<null | string> => {
    try {
      const user = await this.usersService.getOne(code);
      if (!user) {
        return null;
      }

      const isPasswordValid = verifyPassword(password, user.password)

      if (!isPasswordValid) {
        return null;
      }

      const secret = new TextEncoder().encode(env.JWT_SECRET);
      const jwt = await new SignJWT({ ...user })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(secret);

      return jwt;
    } catch (error) {
      console.log(error);
      throw new Error("Error signing in");
    }
  };
}
