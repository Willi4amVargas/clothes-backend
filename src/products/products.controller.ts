import { Request, Response } from "express";

import { CreateProductDto } from "@/products/dto/create-product.dto";
import { UpdateProductDto } from "@/products/dto/update-product.dto";
import { ProductsService } from "@/products/products.service";
import { ProductsStockService } from "@/products_stock/products_stock.service";
import { ProductsUnitsService } from "@/products_units/products_units.service";
import { StorageService } from "@/storage/storage.service";

import { GetAllProductsParamsDto } from "./dto/get-all-products.dto";

export class ProductsController {
  private ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
  constructor(
    private productsService: ProductsService,
    private productsUnitsService: ProductsUnitsService,
    private productsStockService: ProductsStockService,
    private storageService: StorageService,
  ) {}

  create = async (req: Request, res: Response) => {
    const isDryRun = res.locals.dry_run;
    const CreateProductDtoParse = CreateProductDto.safeParse(req.body);

    if (!CreateProductDtoParse.success) {
      return res
        .status(400)
        .json({ message: CreateProductDtoParse.error.issues });
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

  deleteImage = async (req: Request, res: Response) => {
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

    const existingProducts = await this.productsService.getOne(+id);

    if (!existingProducts) {
      res.status(400).json({ message: "Product dont exist" });
      return;
    }

    if (!existingProducts.image_url) {
      res.status(400).json({ message: "This product has no image" });
      return;
    }
    try {
      if (isDryRun) {
        return res.json({
          dry_run: true,
          message:
            "Dry run enabled: delete validated and simulated without persisting changes",
        });
      }
      await this.storageService.delete(existingProducts.image_url);
      await this.productsService.updateImageUrl(existingProducts.id);
      return res.json({ message: "Image deleted successfully" });
    } catch (error: any) {
      if (error.message) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error deleting product image" });
      }
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const paramsDtoParse = GetAllProductsParamsDto.safeParse(req.query);

      if (!paramsDtoParse.success) {
        return res.status(400).json({ message: paramsDtoParse.error.issues });
      }
      const params = paramsDtoParse.data;

      const products = await this.productsService.getAll();
      const productsId = products.map((p) => p.id);

      const productsStock = params.stock
        ? await this.productsStockService.getAll(productsId)
        : [];

      const productsUnits = params.units
        ? await this.productsUnitsService.getAll(productsId)
        : [];

      const productsResponse: any[] = [];
      for (const product of products) {
        productsResponse.push({
          ...product,
          stock: productsStock.filter((p) => p.product_id === product.id),
          units: productsUnits.filter((p) => p.product_id === product.id),
        })
      }

      return res.json(productsResponse);
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error fetching products" });
    }
  };

  getMarks = async (_: Request, res: Response) => {
    try {
      const products = await this.productsService.getMarks();
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
        .json({ message: UpdateProductDtoParse.error.issues });
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

  uploadImage = async (req: Request, res: Response) => {
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

    const existingProducts = await this.productsService.getOne(+id);

    if (!existingProducts) {
      res.status(400).json({ message: "Product dont exist" });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "File must exist" });
      return;
    }

    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return res.status(400).json({
        message: "Format not valid. Only accepts JPEG, PNG y WEBP.",
      });
    }
    // save the file
    try {
      if (isDryRun) {
        return res.json({
          dry_run: true,
          message:
            "Dry run enabled: upload validated and simulated without persisting changes",
        });
      }

      if (existingProducts.image_url) {
        await this.storageService.delete(existingProducts.image_url);
      }
      const finalFileName = await this.storageService.save(
        existingProducts.id.toString(),
        file,
      );
      await this.productsService.updateImageUrl(
        existingProducts.id,
        finalFileName,
      );
      return res.json({ message: "Product image succesfully created" });
    } catch (error: any) {
      if (error.message) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error creating product image" });
      }
    }
  };
}
