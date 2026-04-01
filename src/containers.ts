import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { AuthController } from "@/auth/auth.controller";
import { AuthService } from "@/auth/auth.service";
import pool from "@/config/db";
import { ProductsController } from "@/products/products.controller";
import { ProductsService } from "@/products/products.service";
import { UsersService } from "@/users/users.service";

export const appService = new AppService();
export const appController = new AppController(appService);

export const usersService = new UsersService(pool);

export const authService = new AuthService(usersService);
export const authController = new AuthController(authService);

export const productsService = new ProductsService(pool);
export const productsController = new ProductsController(productsService);
