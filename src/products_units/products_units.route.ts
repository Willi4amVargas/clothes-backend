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
 *       400:
 *         description: Error de validación del body o parámetro
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
route.post("/products_units/:id", productsUnitsController.create);

export default route;
