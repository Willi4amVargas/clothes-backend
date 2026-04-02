import z from "zod";

export const CreateProductUnitDto = z.object({
  unit: z.string().max(100),
  main_unit: z.boolean().default(true),
  cost: z.number().min(0),
  price: z.number().min(0),
});
