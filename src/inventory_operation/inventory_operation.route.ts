import { inventoryOperationController } from "@/containers";
import { Router } from "express";

const route = Router();

/**
 * @openapi
 * /inventory_operation:
 *   get:
 *     description: Devuelve todas las operaciones relacionadas con el inventario en la base de datos
 *     tags:
 *       - Inventario
 *     responses:
 *       200:
 *         description: Devuelve un listado de las operaciones de inventario en la base de datos
 *     security:
 *       - bearerAuth: []
 * /inventory_operation/{correlative}:
 *   get:
 *     description: Devuelve la operacion de inventario pasada por parametro
 *     tags:
 *       - Inventario
 *     parameters:
 *       - in: path
 *         name: correlative
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Devuelve la operacion de inventario pasada por correlativo
 *     security:
 *       - bearerAuth: []
 */
route.get("/inventory_operation", inventoryOperationController.getAll);
route.get(
  "/inventory_operation/:correlative",
  inventoryOperationController.getOne,
);
route.post("/inventory_operation", inventoryOperationController.create);

export default route;
