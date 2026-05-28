import { Request, Response } from "express";

import { ProductsService } from "@/products/products.service";
import { ProductsStockService } from "@/products_stock/products_stock.service";
import { ProductsUnitsService } from "@/products_units/products_units.service";
import { CreateShoppingOperationDto } from "@/shopping_operation/dto/create-shopping-operation.dto";
import { ShoppingOperation } from "@/shopping_operation/models/ShoppingOperation";
import { ShoppingOperationService } from "@/shopping_operation/shopping_operation.service";
import { ShoppingOperationDetail } from "@/shopping_operation_details/models/ShoppingOperationDetail";
import { ShoppingOperationDetailsService } from "@/shopping_operation_details/shopping_operation_details.service";

export class ShoppingOperationController {
  constructor(
    private shoppingOperationService: ShoppingOperationService,
    private shoppingOperationDetailsService: ShoppingOperationDetailsService,
    private productsService: ProductsService,
    private productsUnitsService: ProductsUnitsService,
    private productsStockService: ProductsStockService,
  ) {}

  create = async (req: Request, res: Response) => {
    const createShoppingOperationDtoParse =
      CreateShoppingOperationDto.safeParse(req.body);
    if (!createShoppingOperationDtoParse.success) {
      return res
        .status(400)
        .json({ message: createShoppingOperationDtoParse.error?.issues });
    }

    const shoppingOperation = createShoppingOperationDtoParse.data;
    const isDryRun = res.locals.dry_run;

    try {
      const products = await Promise.all(
        shoppingOperation.shopping_operation_details.map((sod) =>
          this.productsService.getOne(sod.product_id),
        ),
      );
      if (products.includes(null)) {
        return res.status(404).json({ message: "Some products dont exist" });
      }

      const units = await Promise.all(
        shoppingOperation.shopping_operation_details.map((sod) =>
          this.productsUnitsService.getOne(sod.product_id, sod.unit),
        ),
      );
      if (units.includes(null)) {
        return res.status(404).json({ message: "Some units dont exist" });
      }

      const newShoppingOperationDetails: Omit<
        ShoppingOperationDetail,
        "line" | "main_id"
      >[] = [];
      for (
        let i = 0;
        i < shoppingOperation.shopping_operation_details.length;
        i++
      ) {
        const detail = shoppingOperation.shopping_operation_details[i];
        const product = products.find((p) => p?.id === detail.product_id);
        const unit = units.find((u) => u?.id === detail.unit);

        if (!product || !unit) {
          throw new Error("Error getting product or unit for calculate totals");
        }

        const totals = this.shoppingOperationDetailsService.calculateTotals(
          unit.cost,
          detail.amount,
          product.buy_tax,
        );

        newShoppingOperationDetails.push({
          amount: detail.amount,
          buy_aliquot: product.buy_tax,
          description_product: product.description,
          product_id: product.id,
          total: totals.total,
          total_net: totals.total_net,
          total_tax: totals.total_tax,
          unit: unit.id,
          unitary_cost: unit.cost,
        });
      }

      const totals = this.shoppingOperationService.calculateTotals(
        newShoppingOperationDetails,
      );

      if (shoppingOperation.credit > totals.total) {
        return res
          .status(400)
          .json({ message: "Credit cant be more than total" });
      }
      if (shoppingOperation.cash > totals.total) {
        return res
          .status(400)
          .json({ message: "Cash cant be more than total" });
      }
      if (shoppingOperation.credit + shoppingOperation.cash > totals.total) {
        return res
          .status(400)
          .json({ message: "Credit + Cash cant be more than total" });
      }

      const documentNo = await this.shoppingOperationService.getDocumentNo();
      const newShoppingOperation: Omit<
        ShoppingOperation,
        "emission_date" | "id"
      > = {
        cash: shoppingOperation.cash,
        credit: shoppingOperation.credit,
        description: shoppingOperation.description,
        document_no: documentNo,
        operation_type: shoppingOperation.operation_type,
        pending: shoppingOperation.pending,
        total: totals.total,
        total_amount: totals.total_amount,
        total_count_details:
          shoppingOperation.shopping_operation_details.length,
        total_net: totals.total_net,
        total_tax: totals.total_tax,
        user_id: res.locals.user.id,
      };

      if (isDryRun) {
        return res.json({
          ...newShoppingOperation,
          dry_run: true,
          message:
            "Dry run enabled: request validated and simulated without persisting changes",
          shopping_operation_details: newShoppingOperationDetails,
        });
      }

      const createdShoppingOperation =
        await this.shoppingOperationService.create(newShoppingOperation);
      const createdShoppingOperationDetails = await Promise.all(
        newShoppingOperationDetails.map((sod) =>
          this.shoppingOperationDetailsService.create(
            createdShoppingOperation.id,
            sod,
          ),
        ),
      );

      if (shoppingOperation.operation_type === "SHOPPING") {
        await Promise.all(
          shoppingOperation.shopping_operation_details.map((sod) =>
            this.productsStockService.update(
              sod.product_id,
              sod.unit,
              {
                stock: sod.amount,
              },
              true,
            ),
          ),
        );
      }

      return res.json({
        ...createdShoppingOperation,
        shopping_operation_details: createdShoppingOperationDetails,
      });
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error creating ShoppingOperation" });
    }
  };

  getAll = async (_: Request, res: Response) => {
    try {
      const shoppingOperations = await this.shoppingOperationService.getAll();
      return res.json(shoppingOperations);
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error getting ShoppingOperations" });
    }
  };

  getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      res.status(400).json({ message: "Invalid id number" });
      return;
    }

    if (Number.isNaN(+id)) {
      res.status(400).json({ message: "Id is not a number" });
      return;
    }

    if (+id <= 0) {
      res.status(400).json({ message: "Id can't be less or equal to 0" });
      return;
    }

    try {
      const shoppingOperation = await this.shoppingOperationService.getOne(+id);
      if (!shoppingOperation) {
        return res
          .status(404)
          .json({ message: "Shopping operation dont exist" });
      }

      const shoppingOperationDetails =
        await this.shoppingOperationDetailsService.getAll(+id);

      return res.json({
        ...shoppingOperation,
        shopping_operation_details: shoppingOperationDetails,
      });
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error getting ShoppingOperation" });
    }
  };
}
