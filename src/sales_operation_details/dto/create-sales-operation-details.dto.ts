import z from "zod";

export const CreateSalesOperationDetailDto = z.object({
  product_id: z.number().min(1),
  amount: z.number().min(1),
  unit: z.number().min(1),
});
