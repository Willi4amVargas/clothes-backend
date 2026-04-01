import { Router } from "express";
import { productsController } from "@/containers";

const route = Router();

route.get("/products", productsController.getAll);
route.get("/products/:code", productsController.getOne);

export default route;
