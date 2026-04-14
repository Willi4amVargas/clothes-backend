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
 *              control_no:
 *                type: string
 *              client_code:
 *                type: string
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
 *                    code_product:
 *                      type: string
 *                      description: "Codigo del producto"
 *                    unit:
 *                      type: number
 *                      description: "Unidad del producto que se quiere"
 *                    amount:
 *                      description: "Monto del producto"
 *                      type: number
 *           required:
 *            - operation_type
 *            - control_no
 *            - client_code
 *            - seller
 *            - credit
 *            - cash
 *            - sales_operation_details
 *     responses:
 *       200:
 *         description: Devuelve la operacion realizada en la base de datos
 *     security:
 *       - bearerAuth: []
 * /sales_operation/{correlative}:
 *   get:
 *     description: Devuelve la operacion de ventas pasada por parametro
 *     tags:
 *       - Ventas
 *     parameters:
 *       - in: path
 *         name: correlative
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Devuelve la operacion de venta pasada por correlativo
 *     security:
 *       - bearerAuth: []
 */
route.get("/sales_operation", salesOperationController.getAll);
route.get("/sales_operation/:correlative", salesOperationController.getOne);
route.post("/sales_operation/", salesOperationController.create);

export default route;
