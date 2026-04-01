import { SignJWT, jwtVerify } from "jose";
import { UsersService } from "@/users/users.service";
import { env } from "@/config/env";

export class AuthService {
  constructor(private usersService: UsersService) {}

  signIn = async (code: string, password: string): Promise<string | null> => {
    try {
      const user = await this.usersService.getOne(code);
      if (!user) {
        return null;
      }

      if (user.password !== password) {
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
  static verifyToken = async (token: string) => {
    try {
      const secret = new TextEncoder().encode(env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  };
}
