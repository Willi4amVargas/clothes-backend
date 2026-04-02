import z from "zod";
import { CreateProductDto } from "@/products/dto/create-product.dto";
import { UpdateProductUnitDto } from "@/products_units/dto/update-product-unit.dto";

export const UpdateProductDto = z.object({
  ...CreateProductDto.omit({ products_units: true }).partial().shape,
  products_units: z
    .array(
      z.object({
        ...UpdateProductUnitDto.shape,
        correlative: z.number().min(0),
      }),
    )
    .optional(),
});
