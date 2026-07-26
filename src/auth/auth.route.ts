import { Router } from "express";

import { authController } from "@/containers";

const route = Router();

route.post("/signin", authController.signIn);
route.post("/signup", authController.signUp)

export default route;
