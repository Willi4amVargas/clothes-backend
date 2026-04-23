import { CreateSalesOperationDetailDto } from "@/sales_operation_details/dto/create-sales-operation-details.dto";
import z from "zod";

export const CreateSalesOperationDto = z.object({
  operation_type: z.enum(["SALE", "QUOTATION", "ORDER"]),
  client_id: z.number(),
  seller: z.string(),
  description: z.string(),
  //discount: z.number().min(0).max(100).default(0),
  credit: z.number().default(0),
  cash: z.number().default(0),
  pending: z.boolean(),
  sales_operation_details: z.array(CreateSalesOperationDetailDto).min(1),
});
