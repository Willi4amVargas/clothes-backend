import z from "zod";

export const RecoveryPasswordDto = z.object({
  code: z.string(),
});

export const ResetPasswordDto = z.object({
  code: z.string(),
  recovery_code: z.string().length(6),
  new_password: z.string().min(2),
});
