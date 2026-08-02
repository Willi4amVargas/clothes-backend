import z from "zod";

import { CreateProductUnitDto } from "@/products_units/dto/create-product-unit.dto";

export const CreateProductDto = z.object({
  buy_tax: z.number().min(0),
  code: z.string().min(2),
  description: z.string().min(2).max(255),
  discount: z.number().min(0),
  mark_id: z.string().max(100),
  model: z.string().max(100),
  origin: z.string().max(100),
  products_units: z.array(CreateProductUnitDto).min(1),
  referenc: z.string().max(100),
  sale_tax: z.number().min(0),
  status: z.boolean(),
  image_url: z.string().default(""),
});
