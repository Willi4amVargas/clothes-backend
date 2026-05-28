import z from "zod";

import { CreateShoppingOperationDetailDto } from "@/shopping_operation_details/dto/create-shopping-operation-details.dto";

export const CreateShoppingOperationDto = z.object({
  cash: z.number().default(0),
  credit: z.number().default(0),
  description: z.string(),
  operation_type: z.enum(["SHOPPING", "EXPENSE"]),
  pending: z.boolean(),
  shopping_operation_details: z.array(CreateShoppingOperationDetailDto).min(1),
});
