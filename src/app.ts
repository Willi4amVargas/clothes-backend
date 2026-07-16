import cors from "cors";
import express, { Express } from "express";

import AppRoute from "@/app.route";
import { verifyToken } from "@/auth/auth.middleware";
import AuthRoute from "@/auth/auth.route";
import ClientsRoute from "@/clients/clients.route";
import { dryRun } from "@/config/dryRun";
import { logger } from "@/config/logger";
import InventoryOperationRoute from "@/inventory_operation/inventory_operation.route";
import ProductsRoute from "@/products/products.route";
import ProductsUnitsRoute from "@/products_units/products_units.route";
import ReportsRoute from "@/reports/reports.route";
import SalesOperationRoute from "@/sales_operation/sales_operation.route";
import ShoppingOperationRoute from "@/shopping_operation/shopping_operation.route";
import SwaggerRoute from "@/swagger/swagger.route";
import UserRoute from "@/users/users.route";

import { env } from "./config/env";
import { limiter } from "./redis/redis.middleware";

export const boostrap = (): Express => {
  const app = express();
  app.use(express.json());
  if (env.NODE_ENV !== "production") app.use(logger);
  app.use(cors());
  app.use(limiter);

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
    UserRoute,
  ]);
  app.use("/api/reports", [ReportsRoute]);
  return app;
};
