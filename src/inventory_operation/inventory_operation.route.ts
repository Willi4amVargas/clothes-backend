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
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 *   post:
 *     description: Crea una operacion de inventario puede ser "LOAD" o "DOWLOAD" lo cual tambien en consecuencia actualiza el stock de los productos pasados por parametro 
 *     tags:
 *       - Inventario
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
 *                 - LOAD
 *                 - DOWNLOAD
 *              description:
 *                type: string
 *                description: "Detalle o descripcion opcional que se le puede pasar a la operacion"
 *              inventory_operation_details:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    product_id:
 *                      type: number
 *                      description: "Id del producto"
 *                    unit:
 *                      type: number
 *                      description: "Unidad del producto que se quiere cargar o descargar"
 *                    amount:
 *                      description: "Monto a cargar del producto"
 *                      type: number
 *           required:
 *            - operation_type
 *            - inventory_operation_details
 *     responses:
 *       200:
 *         description: Devuelve la operacion completa con resultados calculados
 *       400:
 *         description: Error de validación del body
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 * /inventory_operation/{id}:
 *   get:
 *     description: Devuelve la operacion de inventario pasada por parametro
 *     tags:
 *       - Inventario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Devuelve la operacion de inventario pasada por correlativo
 *       400:
 *         description: Parámetro inválido
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 */
route.get("/inventory_operation", inventoryOperationController.getAll);
route.get(
  "/inventory_operation/:id",
  inventoryOperationController.getOne,
);
route.post("/inventory_operation", inventoryOperationController.create);
// route.put(
//   "/inventory_operation/:correlative",
//   inventoryOperationController.update,
// );

export default route;
