import z from "zod";

export const CreateUserDto = z.object({
  profile: z.number().min(0),
  code: z.string().min(2),
  password: z.string().min(2),
  description: z.string().min(2),
  email: z.email(),
  status: z.boolean(),
});
