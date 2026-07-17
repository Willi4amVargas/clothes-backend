import { Request, Response } from "express";

import { CreateInventoryOperationDto } from "@/inventory_operation/dto/create-inventory-operation.dto";
import { InventoryOperationService } from "@/inventory_operation/inventory_operation.service";
import { InventoryOperationDetailsService } from "@/inventory_operation_details/inventory_operation_details.service";
import { ProductsService } from "@/products/products.service";
import { ProductsStockService } from "@/products_stock/products_stock.service";
import { ProductsUnitsService } from "@/products_units/products_units.service";
import { redisClient } from "@/redis/redis.client";

export class InventoryOperationController {
  constructor(
    private inventoryOperationService: InventoryOperationService,
    private inventoryOperationDetailsService: InventoryOperationDetailsService,
    private productsService: ProductsService,
    private productsUnitsService: ProductsUnitsService,
    private productStockService: ProductsStockService,
  ) {}

  create = async (req: Request, res: Response) => {
    const isDryRun = res.locals.dry_run;
    try {
      const createInventoryOperationDtoParse =
        CreateInventoryOperationDto.safeParse(req.body);
      if (!createInventoryOperationDtoParse.success) {
        return res
          .status(400)
          .json({ message: createInventoryOperationDtoParse.error?.issues });
      }

      const inventoryOperation = createInventoryOperationDtoParse.data;
      // comprobe if products exist and save it
      const productsExist = await Promise.all(
        inventoryOperation.inventory_operation_details.map((iod) =>
          this.productsService.getOne(iod.product_id),
        ),
      );

      if (productsExist.includes(null)) {
        return res.status(400).json({ message: "Some products dont exist" });
      }
      // comprobe if products units exist and save it
      const productsUnitsExist = await Promise.all(
        inventoryOperation.inventory_operation_details.map((iod) =>
          this.productsUnitsService.getOne(iod.product_id, iod.unit),
        ),
      );
      if (productsUnitsExist.includes(null)) {
        return res
          .status(400)
          .json({ message: "Some products units dont exist" });
      }

      // create firts inventory operation details array of object making this loop for inventory operation details
      const newInventoryOperationDetails = [];
      for (
        let i = 0;
        i < inventoryOperation.inventory_operation_details.length;
        i++
      ) {
        const iod = inventoryOperation.inventory_operation_details[i];
        const product = productsExist.find((a) => a?.id === iod.product_id);
        const unit = productsUnitsExist.find(
          (e) => e?.product_id === iod.product_id && e.id === iod.unit,
        );
        if (!product || !unit) {
          return res
            .status(500)
            .json({ message: "An error has ocurred in server" });
        }
        const resultTotals =
          this.inventoryOperationDetailsService.calculateTotals({
            aliquot: product.buy_tax,
            amount: iod.amount,
            unitary_cost: unit.cost,
          });

        const finalDetail = {
          ...iod,
          ...resultTotals,
          aliquot: product.buy_tax,
          description_product: product.description,
          unitary_cost: unit.cost,
        };

        newInventoryOperationDetails.push(finalDetail);
      }
      // finish the loop and with inventory operation details array of objects complete
      // create now inventory operation object
      const inventoryOperationTotals =
        this.inventoryOperationService.calculateTotals({
          details: newInventoryOperationDetails,
        });
      const document_no = await this.inventoryOperationService.getDocumentNo();
      const newInventoryOperation = {
        description: inventoryOperation.description,
        document_no,
        operation_type: inventoryOperation.operation_type,
        user_id: res.locals.user.id,
        ...inventoryOperationTotals,
        inventory_operation_details: newInventoryOperationDetails,
      };

      if (isDryRun) {
        return res.json({
          ...newInventoryOperation,
          dry_run: true,
          inventory_operation_details: newInventoryOperationDetails,
          message:
            "Dry run enabled: request validated and simulated without persisting changes",
        });
      }

      // next save in database inventory operation firts
      const createdInventoryOperation =
        await this.inventoryOperationService.create(newInventoryOperation);
      // second inventory operation details with new id created
      const createdInventoryOperationDetails = await Promise.all(
        newInventoryOperationDetails.map((iod) =>
          this.inventoryOperationDetailsService.create(
            createdInventoryOperation.id,
            iod,
          ),
        ),
      );

      // and finaly update stock
      await Promise.all(
        newInventoryOperationDetails.map((iod) => {
          if (inventoryOperation.operation_type === "DOWNLOAD") {
            return this.productStockService.update(
              iod.product_id,
              iod.unit,
              {
                stock: iod.amount * -1,
              },
              true,
            );
          } else if (inventoryOperation.operation_type === "LOAD") {
            return this.productStockService.update(
              iod.product_id,
              iod.unit,
              {
                stock: iod.amount,
              },
              true,
            );
          }
        }),
      );
      await redisClient.del(`cache:/api/products/`);
      return res.json({
        ...createdInventoryOperation,
        inventory_operation_details: createdInventoryOperationDetails,
      });
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error creating InventoryOperation" });
    }
  };

  getAll = async (_: Request, res: Response) => {
    try {
      const inventoryOperations = await this.inventoryOperationService.getAll();
      return res.json(inventoryOperations);
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error fetching InventoryOperations" });
    }
  };

  getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      res.status(400).json({ message: "Invalid id number" });
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
      const inventoryOperation =
        await this.inventoryOperationService.getOne(+id);
      if (!inventoryOperation) {
        res.status(404).json({ message: "Inventory operation dont exist" });
        return;
      }

      const inventoryOperationDetails =
        await this.inventoryOperationDetailsService.getAll(+id);
      const result = {
        ...inventoryOperation,
        inventory_operation_details: inventoryOperationDetails,
      };
      return res.json(result);
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error fetching InventoryOperation" });
    }
  };

  // update = async (req: Request, res: Response) => {
  //   try {
  //     const UpdateInventoryOperationDtoParse =
  //       UpdateInventoryOperation.safeParse(req.body);

  //     if (!UpdateInventoryOperationDtoParse.success) {
  //       return res
  //         .status(400)
  //         .json({ message: UpdateInventoryOperationDtoParse.error?.issues });
  //     }

  //   } catch (error: any) {
  //     if (error.message) {
  //       return res.status(500).json({ message: error.message });
  //     }
  //     res.status(500).json({ message: "Error creating InventoryOperation" });
  //   }
  // };
}
