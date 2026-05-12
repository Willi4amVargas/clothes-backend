import { Router } from "express";
import { appController } from "@/containers";

export const route = Router();

route.get("/", appController.get);

export default route;
