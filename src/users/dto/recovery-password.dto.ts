import z from "zod";

export const RecoveryPasswordDto = z.object({
  code: z.string(),
});
