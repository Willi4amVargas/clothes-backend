import { Request, Response } from "express";
import { SalesOperationService } from "@/sales_operation/sales_operation.service";
import { CreateSalesOperationDto } from "./dto/create-sales-operation.dto";
import { SalesOperationDetailsService } from "@/sales_operation_details/sales_operation_details.service";
import { ProductsService } from "@/products/products.service";
import { ClientsService } from "@/clients/clients.service";
import { ProductsUnitsService } from "@/products_units/products_units.service";
import { SalesOperationDetail } from "@/sales_operation_details/models/SalesOperationDetail";
import { SalesOperation } from "@/sales_operation/models/SalesOperation";
import { ProductsStockService } from "@/products_stock/products_stock.service";

export class SalesOperationController {
  constructor(
    private salesOperationService: SalesOperationService,
    private salesOperationDetailsService: SalesOperationDetailsService,
    private clientsService: ClientsService,
    private productsService: ProductsService,
    private productsUnitsService: ProductsUnitsService,
    private productStockService: ProductsStockService,
  ) {}
  getAll = async (_: Request, res: Response) => {
    try {
      const salesOperations = await this.salesOperationService.getAll();
      return res.json(salesOperations);
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error getting SalesOperations" });
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
      const salesOperation = await this.salesOperationService.getOne(+id);
      if (!salesOperation) {
        return res.status(400).json({ message: "Sales operation dont exist" });
      }
      const salesOperationDetails =
        await this.salesOperationDetailsService.getAll(+id);

      if (!salesOperationDetails) {
        return res.status(400).json({
          message:
            "there is not sales operation details for this sales operation",
        });
      }
      return res.json({
        ...salesOperation,
        sales_operation_details: salesOperationDetails,
      });
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error getting SalesOperation" });
    }
  };

  create = async (req: Request, res: Response) => {
    const salesOperationDtoParse = CreateSalesOperationDto.safeParse(req.body);

    if (!salesOperationDtoParse.success) {
      return res
        .status(400)
        .json({ message: salesOperationDtoParse.error?.issues });
    }

    const salesOperation = salesOperationDtoParse.data;

    const isDryRun = res.locals.dry_run;

    try {
      // comprobe if client exist
      const client = await this.clientsService.getOne(salesOperation.client_id);
      if (!client) {
        return res.status(404).json({ message: "Client dont exist" });
      }

      // comprobe if products exist
      const products = await Promise.all(
        salesOperation.sales_operation_details.map((p) =>
          this.productsService.getOne(p.product_id),
        ),
      );

      if (products.includes(null)) {
        return res.status(404).json({ message: "Some products dont exist" });
      }

      // comprobe if units exist
      const units = await Promise.all(
        salesOperation.sales_operation_details.map((u) =>
          this.productsUnitsService.getOne(u.product_id, u.unit),
        ),
      );

      if (units.includes(null)) {
        return res.status(404).json({ message: "Some units dont exist" });
      }

      // calculate totals in sales_operation_details
      const newSalesOperationDetails: Omit<
        SalesOperationDetail,
        "main_id" | "line"
      >[] = [];
      let totalAmount = 0;
      for (let i = 0; i < salesOperation.sales_operation_details.length; i++) {
        const detail = salesOperation.sales_operation_details[i];
        const product = products.find((p) => p?.id === detail.product_id);
        const unit = units.find((u) => u?.id === detail.unit);

        if (!product || !unit) {
          throw new Error("Error getting product or unit for calculate totals");
        }

        totalAmount += detail.amount;

        const totalCost = this.salesOperationDetailsService.calculateCostTotals(
          unit.cost,
          detail.amount,
          product.buy_tax,
        );
        const total = this.salesOperationDetailsService.calculateTotals(
          unit.price,
          product.discount,
          detail.amount,
          product.sale_tax,
        );
        const newSalesOperationDetailItem = {
          product_id: product.id,
          description_product: product.description,
          amount: detail.amount,
          unit: unit.id,
          unitary_cost: unit.cost,
          sale_aliquot: product.sale_tax,
          buy_aliquot: product.buy_tax,
          price: unit.price,
          total_net_cost: totalCost.total_net_cost,
          total_tax_cost: totalCost.total_tax_cost,
          total_cost: totalCost.total_cost,
          percent_discount: product.discount,
          discount: total.discount,
          total_net: total.total_net,
          total_tax: total.total_tax,
          total: total.total,
        };
        newSalesOperationDetails.push(newSalesOperationDetailItem);
      }

      const totalsCost = this.salesOperationService.calculateCostTotals(
        newSalesOperationDetails,
      );
      const totals = this.salesOperationService.calculateTotals(
        0,
        newSalesOperationDetails,
      );

      if (salesOperation.credit > totals.total) {
        return res
          .status(400)
          .json({ message: "Credit cant be more than total" });
      }
      if (salesOperation.cash > totals.total) {
        return res
          .status(400)
          .json({ message: "Cash cant be more than total" });
      }
      if (salesOperation.credit + salesOperation.cash > totals.total) {
        return res
          .status(400)
          .json({ message: "Credit + Cash cant be more than total" });
      }

      const documentNo = await this.salesOperationService.getDocumentNo();
      // all calculate, now create object
      const newSalesOperation: Omit<SalesOperation, "id" | "emission_date"> = {
        operation_type: salesOperation.operation_type,
        document_no: documentNo,
        client_id: salesOperation.client_id,
        seller: salesOperation.seller,
        credit_days: client.credit_days,
        description: salesOperation.description,
        user_id: +res.locals.user.id,
        total_amount: totalAmount,
        percent_discount: 0,
        discount: 0,
        total_net: totals.total_net,
        total_exempt: totals.total_exempt,
        total_tax: totals.total_tax,
        total: totals.total,
        credit: salesOperation.credit,
        cash: salesOperation.cash,
        total_net_cost: totalsCost.total_net_cost,
        total_tax_cost: totalsCost.total_tax_cost,
        total_cost: totalsCost.total_cost,
        total_count_details: salesOperation.sales_operation_details.length,
        pending: salesOperation.pending,
      };

      if (isDryRun) {
        return res.json({
          ...newSalesOperation,
          sales_operation_details: newSalesOperationDetails,
          dry_run: true,
          message:
            "Dry run enabled: request validated and simulated without persisting changes",
        });
      }

      // with objects created insert data
      const createdSalesOperation =
        await this.salesOperationService.create(newSalesOperation);

      const createdSalesOperationDetails = await Promise.all(
        newSalesOperationDetails.map((sod) =>
          this.salesOperationDetailsService.create(
            createdSalesOperation.id,
            sod,
          ),
        ),
      );
      // update stock in case is a sale
      if (salesOperation.operation_type === "SALE") {
        await Promise.all(
          salesOperation.sales_operation_details.map((sod) =>
            this.productStockService.update(
              sod.product_id,
              sod.unit,
              {
                stock: -sod.amount,
              },
              true,
            ),
          ),
        );
      }
      return res.json({
        ...createdSalesOperation,
        sales_operation_detail: createdSalesOperationDetails,
      });
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error creating SalesOperation" });
    }
  };
}
