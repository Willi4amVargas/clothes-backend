import { shoppingOperationController } from "@/containers";
import { Router } from "express";

const route = Router();

route.get("/shopping_operation", shoppingOperationController.getAll);
route.get("/shopping_operation/:id", shoppingOperationController.getOne);
route.post("/shopping_operation", shoppingOperationController.create);

export default route;
