import { Request, Response } from "express";
import { randomInt } from "node:crypto";

import {
  hashPassword,
  hashRecoveryCode,
  verifyRecoveryCode,
} from "@/lib/hash.utils";
import { MailService } from "@/mail/mail.service";
import { TemplateService } from "@/templates/template.service";

import {
  RecoveryPasswordDto,
  ResetPasswordDto,
} from "./dto/recovery-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

export class UserController {
  constructor(
    private usersRepository: UsersService,
    private mailService: MailService,
    private templateService: TemplateService,
  ) {}
  getUserBasicInfo = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      res.status(400).json({ message: "Invalid user id" });
      return;
    }

    if (Number.isNaN(+id)) {
      res.status(400).json({ message: "id is not a number" });
      return;
    }

    if (+id <= 0) {
      res.status(400).json({ message: "id can't be less or equal to 0" });
      return;
    }

    const user = await this.usersRepository.getBasicInfo(+id);

    if (!user) {
      return res.status(404).json({ message: "User dont exist" });
    }

    return res.json(user);
  };

  getUserInfo = (_: Request, res: Response) => {
    const { password, ...updatedUserWithoutPassword } = res.locals.user;
    return res.json(updatedUserWithoutPassword);
  };

  recoveryPassword = async (req: Request, res: Response) => {
    const recoveryPasswordDtoParse = RecoveryPasswordDto.safeParse(req.body);
    if (!recoveryPasswordDtoParse.success) {
      return res
        .status(400)
        .json({ message: recoveryPasswordDtoParse.error.issues });
    }

    const userCode = recoveryPasswordDtoParse.data.code;

    try {
      const user = await this.usersRepository.getOne(userCode);

      // Si el usuario no existe, respondemos éxito ficticio para evitar enumeración
      if (!user?.email) {
        return res.json({
          message:
            "Si el usuario existe y tiene un correo asociado, se ha enviado un código de recuperación.",
        });
      }

      // Generar código de 6 dígitos
      const recoveryCode = randomInt(100000, 999999).toString();
      const hashedRecoveryCode = hashRecoveryCode(recoveryCode);

      // Expiración en 15 minutos
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      // Guardar en BD
      await this.usersRepository.setRecoveryCode(
        user.id,
        hashedRecoveryCode,
        expiresAt,
      );

      const templateHTML = await this.templateService.render(
        "recovery_password",
        {
          currentYear: new Date().getFullYear(),
          recoveryCode,
          username: user.description || user.code,
        },
      );

      await this.mailService.sendMail(
        user.email,
        "Recuperación de contraseña",
        templateHTML,
      );

      return res.json({
        message:
          "Si el usuario existe y tiene un correo asociado, se ha enviado un código de recuperación.",
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Error al procesar la recuperación" });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    const resetPasswordDtoParse = ResetPasswordDto.safeParse(req.body);
    if (!resetPasswordDtoParse.success) {
      return res
        .status(400)
        .json({ message: resetPasswordDtoParse.error.issues });
    }

    const { code, new_password, recovery_code } = resetPasswordDtoParse.data;

    try {
      const user = await this.usersRepository.getOne(code);

      if (!user) {
        return res
          .status(400)
          .json({ message: "Código de recuperación inválido o expirado" });
      }

      if (!user.recovery_token || !user.recovery_token_expires_at) {
        return res
          .status(400)
          .json({ message: "No se ha solicitado una recuperación" });
      }

      // Validar expiración
      const now = new Date();
      if (now > new Date(user.recovery_token_expires_at)) {
        return res.status(400).json({ message: "El código ha expirado" });
      }

      // Validar código
      const isValid = verifyRecoveryCode(recovery_code, user.recovery_token);
      if (!isValid) {
        return res
          .status(400)
          .json({ message: "Código de recuperación inválido" });
      }

      // Hashear nueva contraseña
      const hashedPassword = hashPassword(new_password);

      // Actualizar contraseña y limpiar token
      await this.usersRepository.updatePassword(user.id, hashedPassword);

      return res.json({ message: "Contraseña actualizada exitosamente" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Error al restablecer la contraseña" });
    }
  };

  update = async (req: Request, res: Response) => {
    const loggedUser = this.usersRepository.getOnebyId(res.locals.user.id);

    if (!loggedUser) {
      return res.status(404).json({ message: "User logged not found" });
    }

    const UpdateUserDtoParse = UpdateUserDto.safeParse(req.body);

    if (!UpdateUserDtoParse.success) {
      return res.status(400).json({ message: UpdateUserDtoParse.error.issues });
    }

    const userData = { ...UpdateUserDtoParse.data };
    if (userData.password) {
      userData.password = hashPassword(userData.password);
    }

    const updateUser = { ...loggedUser, ...userData };

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
