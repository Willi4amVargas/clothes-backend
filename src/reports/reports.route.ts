import { Router } from "express";

import { reportsController } from "@/containers";

const router = Router();

router.get("/clients/:id/sales", reportsController.getClientSales);

export default router;
