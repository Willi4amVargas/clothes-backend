import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { MailService } from "@/mail/mail.service";
import { RecoveryPasswordDto } from "./dto/recovery-password.dto";
import { TemplateService } from "@/templates/template.service";

export class UserController {
  constructor(
    private usersRepository: UsersService,
    private mailService: MailService,
    private templateService: TemplateService,
  ) {}

  recoveryPassword = async (req: Request, res: Response) => {
    const recoveryPasswordDtoParse = RecoveryPasswordDto.safeParse(req.body);
    if (!recoveryPasswordDtoParse.success) {
      return res
        .status(400)
        .json({ message: recoveryPasswordDtoParse.error?.issues });
    }

    const userCode = recoveryPasswordDtoParse.data.code;

    const user = await this.usersRepository.getOne(userCode);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      const templateHTML = await this.templateService.render(
        "recovery_password",
        {
          username: user.description,
          recoveryCode: "123456",
          currentYear: new Date().getFullYear(),
        },
      );
      await this.mailService.sendMail(
        user.email,
        "Recuperacion de contraseña",
        templateHTML,
      );
      return res.json({ message: "Email sent successfully" });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error recovering user password" });
    }
  };

  getUserInfo = async (_: Request, res: Response) => {
    const { password, ...updatedUserWithoutPassword } = res.locals.user;
    return res.json(updatedUserWithoutPassword);
  };

  update = async (req: Request, res: Response) => {
    const loggedUser = this.usersRepository.getOnebyId(res.locals.user.id);

    if (!loggedUser) {
      return res.status(404).json({ message: "User logged not found" });
    }

    const UpdateUserDtoParse = UpdateUserDto.safeParse(req.body);

    if (!UpdateUserDtoParse.success) {
      return res
        .status(400)
        .json({ message: UpdateUserDtoParse.error?.issues });
    }
    const updateUser = { ...loggedUser, ...UpdateUserDtoParse.data };

    try {
      const updatedUser = await this.usersRepository.update(
        res.locals.user.id,
        updateUser,
      );
      // eliminar la contraseña para el objeto final enviado
      const { password, ...updatedUserWithoutPassword } = updatedUser;
      return res.json(updatedUserWithoutPassword);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error updating user" });
    }
  };
}
