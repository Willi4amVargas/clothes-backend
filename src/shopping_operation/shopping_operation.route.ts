import { shoppingOperationController } from "@/containers";
import { Router } from "express";

const route = Router();

/**
 * @openapi
 * /shopping_operation:
 *   get:
 *     description: Devuelve todas las operaciones de compras registradas
 *     tags:
 *       - Compras
 *     responses:
 *       200:
 *         description: Lista de operaciones de compra
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 *   post:
 *     description: Crea una operación de compra
 *     tags:
 *       - Compras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               operation_type:
 *                 type: string
 *                 enum:
 *                   - SHOPPING
 *                   - EXPENSE
 *               description:
 *                 type: string
 *               credit:
 *                 type: number
 *                 default: 0
 *               cash:
 *                 type: number
 *                 default: 0
 *               pending:
 *                 type: boolean
 *               shopping_operation_details:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: number
 *                     amount:
 *                       type: number
 *                     unit:
 *                       type: number
 *                   required:
 *                     - product_id
 *                     - amount
 *                     - unit
 *             required:
 *               - operation_type
 *               - description
 *               - pending
 *               - shopping_operation_details
 *     responses:
 *       200:
 *         description: Operación de compra creada
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 * /shopping_operation/{id}:
 *   get:
 *     description: Devuelve una operación de compra por id
 *     tags:
 *       - Compras
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Operación de compra encontrada
 *       400:
 *         description: Parámetro inválido
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 */
route.get("/shopping_operation", shoppingOperationController.getAll);
route.get("/shopping_operation/:id", shoppingOperationController.getOne);
route.post("/shopping_operation", shoppingOperationController.create);

export default route;
