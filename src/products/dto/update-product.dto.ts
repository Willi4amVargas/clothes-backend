import { CreateProductDto } from "@/products/dto/create-product.dto";

export const UpdateProductDto = CreateProductDto.partial();
