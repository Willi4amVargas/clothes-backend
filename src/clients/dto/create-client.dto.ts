import z from "zod";

export const CreateClientDto = z.object({
  address: z.string(),
  city: z.string(),
  client_id: z.string().min(0),
  code: z.string().min(0),
  country: z.string(),
  credit_days: z.number().min(0),
  credit_limit: z.number().min(0),
  description: z.string().min(0),
  discount: z.number().min(0),
  email: z.email(),
  phone: z.e164(),
});
