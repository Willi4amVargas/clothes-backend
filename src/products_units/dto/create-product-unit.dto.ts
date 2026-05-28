import z from "zod";

export const CreateProductUnitDto = z.object({
  cost: z.number().min(0),
  price: z.number().min(0),
  unit: z.string().max(100),
});
