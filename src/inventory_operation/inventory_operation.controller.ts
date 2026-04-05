import { InventoryOperationService } from "@/inventory_operation/inventory_operation.service";
import { InventoryOperationDetailsService } from "@/inventory_operation_details/inventory_operation_details.service";
import { Request, Response } from "express";
import { CreateInventoryOperation } from "@/inventory_operation/dto/create-inventory-operation.dto";
import { ProductsService } from "@/products/products.service";
import { ProductsUnitsService } from "@/products_units/products_units.service";
import { ProductsStockService } from "@/products_stock/products_stock.service";
import { User } from "@/users/models/User";

export class InventoryOperationController {
  constructor(
    private inventoryOperationService: InventoryOperationService,
    private inventoryOperationDetailsService: InventoryOperationDetailsService,
    private productsService: ProductsService,
    private productsUnitsService: ProductsUnitsService,
    private productStockService: ProductsStockService,
  ) {}

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
    const { correlative } = req.params;
    console.log("is here");
    if (!correlative || typeof correlative !== "string") {
      res.status(400).json({ message: "Invalid correlative number" });
      return;
    }

    if (Number.isNaN(+correlative)) {
      res.status(400).json({ message: "Correlative is not a number" });
      return;
    }

    if (+correlative <= 0) {
      res
        .status(400)
        .json({ message: "Correlative can't be less or equal to 0" });
      return;
    }
    try {
      const inventoryOperation =
        await this.inventoryOperationService.getOne(+correlative);
      if (!inventoryOperation) {
        res.status(404).json({ message: "Inventory operation dont exist" });
        return;
      }

      const inventoryOperationDetails =
        this.inventoryOperationDetailsService.getAll(+correlative);
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

  create = async (req: Request, res: Response<any, { user: User }>) => {
    try {
      const createInventoryOperationDtoParse =
        CreateInventoryOperation.safeParse(req.body);
      if (!createInventoryOperationDtoParse.success) {
        return res
          .status(400)
          .json({ message: createInventoryOperationDtoParse.error?.issues });
      }

      const inventoryOperation = createInventoryOperationDtoParse.data;
      // comprobe if products exist
      const productsExist = await Promise.all(
        inventoryOperation.inventory_operation_details.map((iod) =>
          this.productsService.getOne(iod.code_product),
        ),
      );

      if (productsExist.includes(null)) {
        return res.status(400).json({ message: "Some products dont exist" });
      }
      // comprobe if products units exist
      const productsUnitsExist = await Promise.all(
        inventoryOperation.inventory_operation_details.map((iod) =>
          this.productsUnitsService.getOne(iod.code_product, iod.unit),
        ),
      );
      if (productsUnitsExist.includes(null)) {
        return res
          .status(400)
          .json({ message: "Some products units dont exist" });
      }

      // updated firts inventory operation details object
      const newInventoryOperationDetails = [];
      for (
        let i = 0;
        i < inventoryOperation.inventory_operation_details.length;
        i++
      ) {
        const iod = inventoryOperation.inventory_operation_details[i];
        const product = productsExist.find((a) => a?.code === iod.code_product);
        const unit = productsUnitsExist.find(
          (e) =>
            e?.product_code === iod.code_product && e.correlative === iod.unit,
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
          description_product: product.description,
          referenc: product.referenc,
          mark: product.mark,
          model: product.model,
          unitary_cost: unit.cost,
          aliquot: product.buy_tax,
        };

        newInventoryOperationDetails.push(finalDetail);
      }
      // updated now inventory operation object
      const inventoryOperationTotals =
        this.inventoryOperationService.calculateTotals({
          details: newInventoryOperationDetails,
        });
      const document_no = await this.inventoryOperationService.getDocumentNo();
      const newInventoryOperation = {
        document_no,
        user_code: res.locals.user.code,
        operation_type: inventoryOperation.operation_type,
        description: inventoryOperation.description,
        ...inventoryOperationTotals,
        inventory_operation_details: newInventoryOperationDetails,
      };

      // next save in database
      const createdInventoryOperation =
        await this.inventoryOperationService.create(newInventoryOperation);

      const createdInventoryOperationDetails = await Promise.all(
        newInventoryOperationDetails.map((iod) =>
          this.inventoryOperationDetailsService.create(
            createdInventoryOperation.correlative,
            iod,
          ),
        ),
      );

      // and finaly update stock
      await Promise.all(
        newInventoryOperationDetails.map((iod) => {
          if (inventoryOperation.operation_type === "DOWNLOAD") {
            return this.productStockService.update(
              iod.code_product,
              iod.unit,
              {
                stock: iod.amount * -1,
              },
              true,
            );
          } else if (inventoryOperation.operation_type === "LOAD") {
            return this.productStockService.update(
              iod.code_product,
              iod.unit,
              {
                stock: iod.amount,
              },
              true,
            );
          }
        }),
      );

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
}
