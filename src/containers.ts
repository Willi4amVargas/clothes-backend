import pool from "@/config/db";
import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { AuthController } from "@/auth/auth.controller";
import { AuthService } from "@/auth/auth.service";
import { ProductsController } from "@/products/products.controller";
import { ProductsService } from "@/products/products.service";
import { UsersService } from "@/users/users.service";
import { ProductsUnitsService } from "@/products_units/products_units.service";
import { ProductsStockService } from "@/products_stock/products_stock.service";
import { ProductsUnitsController } from "@/products_units/products_units.controller";

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
);
export const productsUnitsController = new ProductsUnitsController(
  productsUnitsService,
);
