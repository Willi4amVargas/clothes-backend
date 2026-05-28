import z from "zod";

export const CreateUserDto = z.object({
  code: z.string().min(2),
  description: z.string().min(2),
  email: z.email(),
  password: z.string().min(2),
  profile: z.number().min(0),
  status: z.boolean(),
});
