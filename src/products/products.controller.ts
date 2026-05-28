import { Request, Response } from "express";

import { CreateProductDto } from "@/products/dto/create-product.dto";
import { UpdateProductDto } from "@/products/dto/update-product.dto";
import { ProductsService } from "@/products/products.service";
import { ProductsStockService } from "@/products_stock/products_stock.service";
import { ProductsUnitsService } from "@/products_units/products_units.service";

export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private productsUnitsService: ProductsUnitsService,
    private productsStockService: ProductsStockService,
  ) {}

  create = async (req: Request, res: Response) => {
    const isDryRun = res.locals.dry_run;
    const CreateProductDtoParse = CreateProductDto.safeParse(req.body);

    if (!CreateProductDtoParse.success) {
      return res
        .status(400)
        .json({ message: CreateProductDtoParse.error?.issues });
    }
    const product = CreateProductDtoParse.data;

    try {
      if (isDryRun) {
        const simulatedProduct = { ...product, id: 0 };
        const simulatedUnits = product.products_units.map((unit, index) => ({
          ...unit,
          id: index + 1,
          product_id: 0,
        }));
        const simulatedStock = simulatedUnits.map((unit) => ({
          product_id: 0,
          stock: 0,
          unit: unit.id,
        }));
        return res.status(201).json({
          ...simulatedProduct,
          dry_run: true,
          message:
            "Dry run enabled: request validated and simulated without persisting changes",
          stock: simulatedStock,
          units: simulatedUnits,
        });
      }
      const newProduct = await this.productsService.create(product);
      const newUnits = await Promise.all(
        product.products_units.map((unit) =>
          this.productsUnitsService.create(newProduct.id, unit),
        ),
      );
      const newStock = await Promise.all(
        newUnits.map((unit) =>
          this.productsStockService.create(newProduct.id, unit.id, {
            stock: 0,
          }),
        ),
      );
      const result = { ...newProduct, stock: newStock, units: newUnits };
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error creating product" });
    }
  };

  delete = async (req: Request, res: Response) => {
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

    try {
      if (isDryRun) {
        const existingProduct = await this.productsService.getOne(+id);
        if (!existingProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        return res.json({
          dry_run: true,
          message:
            "Dry run enabled: delete validated and simulated without persisting changes",
        });
      }
      await this.productsService.delete(+id);
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error deleting product" });
    }
  };

  getAll = async (_: Request, res: Response) => {
    try {
      const products = await this.productsService.getAll();
      res.json(products);
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error fetching products" });
    }
  };

  getOne = async (req: Request, res: Response) => {
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

    try {
      const product = await this.productsService.getOne(+id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const units = await this.productsUnitsService.getAll(+id);
      const stock = await this.productsStockService.getAll(+id);

      const result = {
        ...product,
        stock,
        units,
      };

      return res.json(result);
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error fetching product" });
    }
  };

  update = async (req: Request, res: Response) => {
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

    const UpdateProductDtoParse = UpdateProductDto.safeParse(req.body);

    if (!UpdateProductDtoParse.success) {
      return res
        .status(400)
        .json({ message: UpdateProductDtoParse.error?.issues });
    }
    const product = UpdateProductDtoParse.data;

    try {
      if (isDryRun) {
        const existingProduct = await this.productsService.getOne(+id);
        if (!existingProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        const simulatedProductUnits = product.products_units ?? null;
        return res.status(201).json({
          ...existingProduct,
          ...product,
          dry_run: true,
          message:
            "Dry run enabled: request validated and simulated without persisting changes",
          products_units: simulatedProductUnits,
        });
      }
      const updatedProduct = await this.productsService.update(+id, product);
      let updatedProductUnits = null;

      if (product.products_units) {
        updatedProductUnits = await Promise.all(
          product.products_units.map((unit) =>
            this.productsUnitsService.update(updatedProduct.id, unit.id, unit),
          ),
        );
      }
      const result = { ...updatedProduct, products_units: updatedProductUnits };
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error updating product" });
      }
    }
  };
}
