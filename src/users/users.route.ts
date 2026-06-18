import { Router } from "express";

import { userController } from "@/containers";

const router = Router();

router.get("/profile", userController.getUserInfo);
router.put("/profile", userController.update);
router.post("/recovery_password", userController.recoveryPassword);
router.put("/recovery_password", userController.resetPassword);
router.get("/profile/:id", userController.getUserBasicInfo);

export default router;
