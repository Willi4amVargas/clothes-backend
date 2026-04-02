import express, { NextFunction, Request, Response } from "express";
import { env } from "@/config/env";
import AppRoute from "@/app.route";
import AuthRoute from "@/auth/auth.route";
import ProductsRoute from "@/products/products.route";
import ProductsUnitsRoute from "@/products_units/products_units.route";
import { verifyToken } from "@/auth/auth.middleware";

const logger = (req: Request, _: Response, next: NextFunction) => {
  console.log(req.method, req.url);
  next();
};

const boostrap = () => {
  const PORT = env.PORT || 3000;
  // despues se arregla para que no sea solo el console.log
  const HOST = env.HOST || "localhost";
  const app = express();
  app.use(express.json());
  app.use(logger);
  app.use(verifyToken);

  app.use("/api", [AppRoute, AuthRoute, ProductsRoute, ProductsUnitsRoute]);

  app.listen(PORT, () => {
    console.log("Listen on http://" + HOST + ":" + PORT);
  });
};

boostrap();
