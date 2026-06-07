import z from "zod";

export const GetAllProductsParamsDto = z.object({
  units: z.stringbool().default(false),
  stock: z.stringbool().default(false),
});
