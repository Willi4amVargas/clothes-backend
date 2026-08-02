import { Request, Response } from "express";

import { AuthService } from "@/auth/auth.service";
import { AuthDto } from "@/auth/dto/auth.dto";
import { SignupDto } from "./dto/signup.dto";

export class AuthController {
  constructor(private authService: AuthService) { }

  signIn = async (req: Request, res: Response) => {
    const authDtoParse = AuthDto.safeParse(req.body);

    if (!authDtoParse.success) {
      return res.status(400).json({ message: authDtoParse.error?.issues });
    }

    const { code, password } = authDtoParse.data;
    try {
      const token = await this.authService.signIn(code, password);
      if (!token) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({ token });
    } catch {
      res.status(500).json({ message: "Error signing in" });
    }
  };

  signUp = async (req: Request, res: Response) => {
    const signupDtoParse = SignupDto.safeParse(req.body)
    if (!signupDtoParse.success) {
      return res.status(400).json({ message: signupDtoParse.error?.issues });
    }
    const data = signupDtoParse.data;

    try {
      const createdUser = await this.authService.signUp(data)

      return res.json({ message: "User created successfully", createdUser })
    } catch (error: any) {
      if (error.message) {

        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error signup" })
    }
  }
}
