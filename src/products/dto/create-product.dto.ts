import { CreateProductUnitDto } from "@/products_units/dto/create-product-unit.dto";
import z from "zod";

export const CreateProductDto = z.object({
  code: z.string().min(2),
  description: z.string().min(2).max(255),
  mark: z.string().max(100),
  model: z.string().max(100),
  referenc: z.string().max(100),
  discount: z.number().min(0),
  status: z.boolean(),
  origin: z.string().max(100),
  buy_tax: z.number().min(0),
  sale_tax: z.number().min(0),
  products_units: z.array(CreateProductUnitDto).min(1),
});
