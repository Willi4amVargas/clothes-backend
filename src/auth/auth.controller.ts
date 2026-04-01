import { AuthService } from "@/auth/auth.service";
import { Request, Response } from "express";
import { AuthDto } from "@/auth/dto/auth.dto";

export class AuthController {
  constructor(private authService: AuthService) {}

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
    } catch (error) {
      res.status(500).json({ message: "Error signing in" });
    }
  };
}
