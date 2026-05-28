import z from "zod";

import { CreateSalesOperationDetailDto } from "@/sales_operation_details/dto/create-sales-operation-details.dto";

export const CreateSalesOperationDto = z.object({
  cash: z.number().default(0),
  client_id: z.number(),
  //discount: z.number().min(0).max(100).default(0),
  credit: z.number().default(0),
  description: z.string(),
  operation_type: z.enum(["SALE", "QUOTATION", "ORDER"]),
  pending: z.boolean(),
  sales_operation_details: z.array(CreateSalesOperationDetailDto).min(1),
  seller: z.string(),
});
