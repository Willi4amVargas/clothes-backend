import z from "zod";

export const CreateProductDto = z.object({
  code: z.string(),
  description: z.string().max(255),
  short_name: z.string().max(100),
  mark: z.string().max(100),
  model: z.string().max(100),
  referenc: z.string().max(100),
  discount: z.number().min(0).default(0),
  status: z.boolean().default(true),
  origin: z.string().max(100),
  buy_tax: z.number().min(0),
  sale_tax: z.number().min(0),
});
