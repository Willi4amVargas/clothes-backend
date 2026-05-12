import { productsUnitsController } from "@/containers";
import { Router } from "express";

const route = Router();

route.post("/products_units/:id", productsUnitsController.create);

export default route;
