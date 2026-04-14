import z from "zod";

export const CreateSalesOperationDetailDto = z.object({
  code_product: z.string().min(2),
  amount: z.number().min(0),
  unit: z.number().min(0),
});
