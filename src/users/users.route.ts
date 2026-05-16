import { userController } from "@/containers";
import { Router } from "express";

const router = Router();

router.get("/profile", userController.getUserInfo);
router.put("/profile", userController.update);
router.post("/recovery_password", userController.recoveryPassword);
router.put("/recovery_password", userController.resetPassword);

export default router;
