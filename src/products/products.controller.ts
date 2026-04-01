import { Request, Response } from "express";
import { ProductsService } from "@/products/products.service";
import { CreateProductDto } from "@/products/dto/create-product.dto";
import { UpdateProductDto } from "@/products/dto/update-product.dto";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

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
    const { code } = req.params;
    if (!code || typeof code !== "string") {
      res.status(400).json({ message: "Invalid product code" });
      return;
    }

    try {
      const product = await this.productsService.getOne(code);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error fetching product" });
    }
  };

  create = async (req: Request, res: Response) => {
    const CreateProductDtoParse = CreateProductDto.safeParse(req.body);

    if (!CreateProductDtoParse.success) {
      return res
        .status(400)
        .json({ message: CreateProductDtoParse.error?.issues });
    }
    const product = CreateProductDtoParse.data;

    try {
      const newProduct = await this.productsService.create(product);
      res.status(201).json(newProduct);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error creating product" });
    }
  };

  update = async (req: Request, res: Response) => {
    const { code } = req.params;
    if (!code || typeof code !== "string") {
      res.status(400).json({ message: "Invalid product code" });
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
      const updatedProduct = await this.productsService.update(code, product);
      res.json(updatedProduct);
    } catch (error: any) {
      if (error.message) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error updating product" });
      }
    }
  };

  delete = async (req: Request, res: Response) => {
    const { code } = req.params;
    if (!code || typeof code !== "string") {
      res.status(400).json({ message: "Invalid product code" });
      return;
    }

    try {
      await this.productsService.delete(code);
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error deleting product" });
    }
  };
}
