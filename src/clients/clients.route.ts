import { Router } from "express";

import { clientsController } from "@/containers";

const route = Router();

route.get("/clients", clientsController.getAll);
route.get("/clients/:id", clientsController.getOne);
route.post("/clients", clientsController.create);
route.put("/clients/:id", clientsController.update);
route.delete("/clients/:id", clientsController.delete);

export default route;
