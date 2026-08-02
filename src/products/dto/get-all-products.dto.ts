import z from "zod";

const preprocessIds = (val: any) => {
  if (typeof val === "string") {
    const formatValue = val.split(",");
    return formatValue;
  } else {
    return val;
  }
};

export const GetAllProductsParamsDto = z.object({
  ids: z.preprocess(preprocessIds, z.array(z.coerce.string())).optional(),
  stock: z.stringbool().default(false),
  units: z.stringbool().default(false),
});
