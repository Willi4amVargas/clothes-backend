import z from "zod";

export const CreateShoppingOperationDetailDto = z.object({
  amount: z.number().min(1),
  product_id: z.number().min(1),
  unit: z.number().min(1),
});
