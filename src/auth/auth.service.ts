import { JWTPayload, jwtVerify, SignJWT } from "jose";

import { env } from "@/config/env";
import { verifyPassword } from "@/lib/hash.utils";
import { UsersService } from "@/users/users.service";
import { MailService } from "@/mail/mail.service";
import { TemplateService } from "@/templates/template.service";
import { users } from "#/client";
import { ProfileService } from "@/profile/profile.service";

interface UserPayload extends JWTPayload, users { }
export class AuthService {
  constructor(private usersService: UsersService, private mailService: MailService, private templateService: TemplateService, private profileService: ProfileService) { }

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
  signIn = async (code: string, user_password: string): Promise<null | string> => {
    try {
      const user = await this.usersService.getOne(code);
      if (!user) {
        return null;
      }

      const isPasswordValid = verifyPassword(user_password, user.password)

      if (!isPasswordValid) {
        return null;
      }
      // quitamos datos sensibles para no enviarlos al usuario
      const { password, recovery_token, recovery_token_expires_at, ...allOtherParams } = user

      const secret = new TextEncoder().encode(env.JWT_SECRET);
      const jwt = await new SignJWT({ ...allOtherParams })
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

  signUp = async (data: Omit<users, "id" | "recovery_token" | "recovery_token_expires_at" | "status">) => {
    try {
      const profile = await this.profileService.getOne(data.profile_id)
      if (!profile) {
        throw new Error("This profile dont exist");
      }
      const newUser = await this.usersService.create(data)
      const html = await this.templateService.render("user-created", newUser)
      if (!newUser.email) {
        throw new Error("No email recived in params");
      }
      const emailId = await this.mailService.sendMail(newUser.email, "USUARIO CREADO EXITOSAMENTE", html)
      return { ...newUser, emailId }
    } catch (error: any) {
      console.log(error);
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error("Error signup in");
    }
  }
}
