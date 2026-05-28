import { Router } from "express";

import { productsUnitsController } from "@/containers";

const route = Router();

route.post("/products_units/:id", productsUnitsController.create);

export default route;
