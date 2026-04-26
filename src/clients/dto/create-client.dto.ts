import z from "zod";

export const CreateClientDto = z.object({
  code: z.string().min(0),
  description: z.string().min(0),
  client_id: z.string().min(0),
  email: z.string(),
  phone: z.string(),
  country: z.string(),
  city: z.string(),
  address: z.string(),
  credit_days: z.number().min(0),
  credit_limit: z.number().min(0),
  discount: z.number().min(0),
});
