import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { UsersService } from "@/users/users.service";
import { env } from "@/config/env";
import { User } from "@/users/models/User";

interface UserPayload extends JWTPayload, User {}
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
}
