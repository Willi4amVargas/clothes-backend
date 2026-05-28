import { Router } from "express";

import { salesOperationController } from "@/containers";

const route = Router();


route.get("/sales_operation", salesOperationController.getAll);
route.get("/sales_operation/:id", salesOperationController.getOne);
route.post("/sales_operation/", salesOperationController.create);

export default route;
