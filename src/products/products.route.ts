import { Router } from "express";

import { productsController } from "@/containers";

const route = Router();

route.get("/products", productsController.getAll);
route.get("/products/:id", productsController.getOne);
route.post("/products", productsController.create);
route.put("/products/:id", productsController.update);
route.delete("/products/:id", productsController.delete);

export default route;
