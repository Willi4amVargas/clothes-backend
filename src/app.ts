import express, { Express } from "express";
import AppRoute from "@/app.route";
import AuthRoute from "@/auth/auth.route";
import ProductsRoute from "@/products/products.route";
import ProductsUnitsRoute from "@/products_units/products_units.route";
import InventoryOperationRoute from "@/inventory_operation/inventory_operation.route";
import ClientsRoute from "@/clients/clients.route";
import SalesOperationRoute from "@/sales_operation/sales_operation.route";
import ShoppingOperationRoute from "@/shopping_operation/shopping_operation.route";
import SwaggerRoute from "@/swagger/swagger.route";
import { verifyToken } from "@/auth/auth.middleware";
import { dryRun } from "@/config/dryRun";
import { logger } from "@/config/logger";
import cors from "cors"

export const boostrap = (): Express => {
  const app = express();
  app.use(express.json());
  app.use(logger);
  app.use(cors())

  app.use("/api", SwaggerRoute);

  app.use(verifyToken);
  app.use(dryRun);

  app.use("/api", [
    AppRoute,
    AuthRoute,
    ProductsRoute,
    ProductsUnitsRoute,
    InventoryOperationRoute,
    ClientsRoute,
    SalesOperationRoute,
    ShoppingOperationRoute,
  ]);
  return app;
};
