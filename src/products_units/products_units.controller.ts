import { Request, Response } from "express";

import { ProductsStockService } from "@/products_stock/products_stock.service";
import { CreateProductUnitDto } from "@/products_units/dto/create-product-unit.dto";
import { ProductsUnitsService } from "@/products_units/products_units.service";

export class ProductsUnitsController {
  constructor(
    private productsUnitsService: ProductsUnitsService,
    private productsStockService: ProductsStockService,
  ) {}

  create = async (req: Request, res: Response) => {
    const isDryRun = res.locals.dry_run;
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
        .json({ message: createProductUnitDtoParse.error.issues });
    }

    const unit = createProductUnitDtoParse.data;

    try {
      if (isDryRun) {
        return res.status(201).json({
          id: 0,
          product_id: +id,
          ...unit,
          dry_run: true,
          message:
            "Dry run enabled: request validated and simulated without persisting changes",
        });
      }
      const newUnit = await this.productsUnitsService.create(+id, unit);
      const newStock = await this.productsStockService.create(+id, newUnit.id, {
        stock: 0,
      });
      return res.status(201).json({ ...newUnit, stock: newStock });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error creating product unit" });
    }
  };
}
