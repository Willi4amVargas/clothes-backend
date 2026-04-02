import { Request, Response } from "express";
import { ProductsUnitsService } from "@/products_units/products_units.service";
import { CreateProductUnitDto } from "@/products_units/dto/create-product-unit.dto";

export class ProductsUnitsController {
  constructor(private productsUnitsService: ProductsUnitsService) {}

  create = async (req: Request, res: Response) => {
    const { code } = req.params;
    if (!code || typeof code !== "string") {
      res.status(400).json({ message: "Invalid product code" });
      return;
    }

    const createProductUnitDtoParse = CreateProductUnitDto.safeParse(req.body);
    if (!createProductUnitDtoParse.success) {
      return res
        .status(400)
        .json({ message: createProductUnitDtoParse.error?.issues });
    }

    const unit = createProductUnitDtoParse.data;

    try {
      const newUnit = await this.productsUnitsService.create(code, unit);
      return res.status(201).json(newUnit);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error creating product unit" });
    }
  };
}
