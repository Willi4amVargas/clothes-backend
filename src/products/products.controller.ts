import { ProductsService } from "@/products/products.service";
import { Request, Response } from "express";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  getAll = async (_: Request, res: Response) => {
    try {
      const products = await this.productsService.getAll();
      res.json(products);
    } catch (error) {
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
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  };
}
