import z from "zod";

export const CreateProductUnitDto = z.object({
  unit: z.string().max(100),
  cost: z.number().min(0),
  price: z.number().min(0),
});
