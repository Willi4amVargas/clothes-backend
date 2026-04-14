import { productsUnitsController } from "@/containers";
import { Router } from "express";

const route = Router();

/**
 * @openapi
 * /products_units/{id}:
 *   post:
 *     description: Crea una nueva unidad de producto para el producto con el código especificado
 *     tags:
 *       - Productos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              unit:
 *                type: string
 *              main_unit:
 *                type: boolean
 *                default: true
 *              cost:
 *                type: number
 *              price:
 *                type: number
 *            required:
 *              - unit
 *              - cost
 *              - price
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retorna la unidad de producto creada
 */
route.post("/products_units/:id", productsUnitsController.create);

export default route;
