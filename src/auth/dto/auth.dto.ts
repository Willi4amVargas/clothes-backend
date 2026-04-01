import z from "zod";

export const AuthDto = z.object({
  code: z.string().min(1, "Code is required"),
  password: z.string().min(1, "Password is required"),
});
