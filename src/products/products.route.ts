import { Router } from "express";

import { productsController } from "@/containers";
import { publicImagesFolder } from "@/storage/storage.middleware";

import { productsImageMiddleware } from "./products.middleware";

const route = Router();

route.use("/products", publicImagesFolder)

route.get("/products", productsController.getAll);
route.get("/products/marks", productsController.getMarks);
route.get("/products/:id", productsController.getOne);
route.post("/products", productsController.create);
route.put("/products/:id", productsController.update);
route.delete("/products/:id", productsController.delete);
route.post("/products/:id/image", productsImageMiddleware, productsController.uploadImage)
route.delete("/products/:id/image", productsController.deleteImage)


export default route;
