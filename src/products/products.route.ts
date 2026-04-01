import { Router } from "express";
import { productsController } from "@/containers";

const route = Router();

route.get("/products", productsController.getAll);
route.get("/products/:code", productsController.getOne);
route.post("/products", productsController.create);
route.put("/products/:code", productsController.update);
route.delete("/products/:code", productsController.delete);

export default route;
