import { CreateShoppingOperationDetailDto } from "@/shopping_operation_details/dto/create-shopping-operation-details.dto";
import z from "zod";

export const CreateShoppingOperationDto = z.object({
  operation_type: z.enum(["SHOPPING", "EXPENSE"]),
  description: z.string(),
  credit: z.number().default(0),
  cash: z.number().default(0),
  pending: z.boolean(),
  shopping_operation_details: z.array(CreateShoppingOperationDetailDto).min(1),
});
