import { CreateSalesOperationDetailDto } from "@/sales_operation_details/dto/create-sales-operation-details.dto";
import z from "zod";

export const CreateSalesOperationDto = z.object({
  operation_type: z.enum(["SALE", "QUOTATION", "ORDER"]),
  client_code: z.string(),
  seller: z.string(),
  description: z.string(),
  credit: z.number(),
  cash: z.number(),
  pending: z.boolean(),
  sales_operation_details: z.array(CreateSalesOperationDetailDto).min(1),
});
