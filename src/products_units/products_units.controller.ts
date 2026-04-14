import { Request, Response } from "express";
import { ProductsUnitsService } from "@/products_units/products_units.service";
import { CreateProductUnitDto } from "@/products_units/dto/create-product-unit.dto";

export class ProductsUnitsController {
  constructor(private productsUnitsService: ProductsUnitsService) {}

  create = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      res.status(400).json({ message: "Invalid product code" });
      return;
    }

    if (Number.isNaN(+id)) {
      res.status(400).json({ message: "id is not a number" });
      return;
    }

    if (+id <= 0) {
      res.status(400).json({ message: "id can't be less or equal to 0" });
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
      const newUnit = await this.productsUnitsService.create(+id, unit);
      return res.status(201).json(newUnit);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error creating product unit" });
    }
  };
}
