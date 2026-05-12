import { inventoryOperationController } from "@/containers";
import { Router } from "express";

const route = Router();

route.get("/inventory_operation", inventoryOperationController.getAll);
route.get("/inventory_operation/:id", inventoryOperationController.getOne);
route.post("/inventory_operation", inventoryOperationController.create);
// route.put(
//   "/inventory_operation/:correlative",
//   inventoryOperationController.update,
// );

export default route;
