import { Router } from "express";
import { authController } from "@/containers";

const route = Router();

route.post("/signin", authController.signIn);

export default route;
