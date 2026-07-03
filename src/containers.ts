import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { AuthController } from "@/auth/auth.controller";
import { AuthService } from "@/auth/auth.service";
import { ClientsController } from "@/clients/clients.controller";
import { ClientsService } from "@/clients/clients.service";
import pool from "@/config/db";
import { InventoryOperationController } from "@/inventory_operation/inventory_operation.controller";
import { InventoryOperationService } from "@/inventory_operation/inventory_operation.service";
import { InventoryOperationDetailsService } from "@/inventory_operation_details/inventory_operation_details.service";
import { MailService } from "@/mail/mail.service";
import { transporter } from "@/mail/mail.transporter";
import { ProductsController } from "@/products/products.controller";
import { ProductsService } from "@/products/products.service";
import { ProductsStockService } from "@/products_stock/products_stock.service";
import { ProductsUnitsController } from "@/products_units/products_units.controller";
import { ProductsUnitsService } from "@/products_units/products_units.service";
import { SalesOperationController } from "@/sales_operation/sales_operation.controller";
import { SalesOperationService } from "@/sales_operation/sales_operation.service";
import { SalesOperationDetailsService } from "@/sales_operation_details/sales_operation_details.service";
import { ShoppingOperationController } from "@/shopping_operation/shopping_operation.controller";
import { ShoppingOperationService } from "@/shopping_operation/shopping_operation.service";
import { ShoppingOperationDetailsService } from "@/shopping_operation_details/shopping_operation_details.service";
import { StorageService } from "@/storage/storage.service";
import { TemplateService } from "@/templates/template.service";
import { UserController } from "@/users/users.controller";
import { UsersService } from "@/users/users.service";

import { ReportsController } from "./reports/reports.controller";
import { ReportsService } from "./reports/reports.service";

export const templateService = new TemplateService();
export const storageService = new StorageService();

export const appService = new AppService();
export const appController = new AppController(appService);

export const usersService = new UsersService(pool);

export const authService = new AuthService(usersService);
export const authController = new AuthController(authService);

export const productsStockService = new ProductsStockService(pool);

export const productsService = new ProductsService(pool);
export const productsUnitsService = new ProductsUnitsService(
  pool,
  productsService,
);
export const productsController = new ProductsController(
  productsService,
  productsUnitsService,
  productsStockService,
  storageService,
);
export const productsUnitsController = new ProductsUnitsController(
  productsUnitsService,
  productsStockService,
);

export const inventoryOperationDetailsService =
  new InventoryOperationDetailsService(pool);
export const inventoryOperationService = new InventoryOperationService(pool);
export const inventoryOperationController = new InventoryOperationController(
  inventoryOperationService,
  inventoryOperationDetailsService,
  productsService,
  productsUnitsService,
  productsStockService,
);

export const clientsService = new ClientsService(pool);
export const clientsController = new ClientsController(clientsService);

export const salesOperationDetailsService = new SalesOperationDetailsService(
  pool,
);

export const salesOperationService = new SalesOperationService(pool);
export const salesOperationController = new SalesOperationController(
  salesOperationService,
  salesOperationDetailsService,
  clientsService,
  productsService,
  productsUnitsService,
  productsStockService,
);

export const shoppingOperationDetailsService =
  new ShoppingOperationDetailsService(pool);

export const shoppingOperationService = new ShoppingOperationService(pool);
export const shoppingOperationController = new ShoppingOperationController(
  shoppingOperationService,
  shoppingOperationDetailsService,
  productsService,
  productsUnitsService,
  productsStockService,
);

export const mailService = new MailService(transporter);

export const userController = new UserController(
  usersService,
  mailService,
  templateService,
);

export const reportsService = new ReportsService(pool);
export const reportsController = new ReportsController(reportsService);
