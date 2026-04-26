import { salesOperationController } from "@/containers";
import { Router } from "express";

const route = Router();

/**
 * @openapi
 * /sales_operation:
 *   get:
 *     description: Devuelve las operaciones relacionadas con ventas en la base de datos
 *     tags:
 *       - Ventas
 *     responses:
 *       200:
 *         description: Devuelve un listado de las operaciones de ventas en la base de datos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 *   post:
 *     description: Crea una operacion de ventas en la base de datos
 *     tags:
 *       - Ventas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              operation_type:
 *                type: string
 *                description: "El tipo de operación a realizar"
 *                enum:
 *                 - SALE
 *                 - QUOTATION
 *                 - ORDER
 *              description:
 *                type: string
 *                description: "Detalle o descripcion opcional que se le puede pasar a la operacion"
 *              client_id:
 *                type: number
 *              seller:
 *                type: string
 *              credit:
 *                type: number
 *              cash:
 *                type: number
 *              pending:
 *                type: boolean
 *                default: false
 *              sales_operation_details:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    product_id:
 *                      type: number
 *                      description: "Id del producto"
 *                    unit:
 *                      type: number
 *                      description: "Unidad del producto que se quiere"
 *                    amount:
 *                      description: "Monto del producto"
 *                      type: number
 *           required:
 *            - operation_type
 *            - client_id
 *            - seller
 *            - pending
 *            - sales_operation_details
 *     responses:
 *       200:
 *         description: Devuelve la operacion realizada en la base de datos
 *       400:
 *         description: Error de validación del body
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 * /sales_operation/{id}:
 *   get:
 *     description: Devuelve la operacion de ventas pasada por parametro
 *     tags:
 *       - Ventas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Devuelve la operacion de venta pasada por correlativo
 *       400:
 *         description: Parámetro inválido
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 */
route.get("/sales_operation", salesOperationController.getAll);
route.get("/sales_operation/:id", salesOperationController.getOne);
route.post("/sales_operation/", salesOperationController.create);

export default route;
