import { Router } from "express";
import { productsController } from "@/containers";

const route = Router();
/**
 * @openapi
 * /products:
 *   get:
 *     description: Devuelve la lista de todos los productos
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Retorna un array con todos los productos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 *   post:
 *     description: Crea un nuevo producto con los datos proporcionados
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              code:
 *                type: string
 *              description:
 *                type: string
 *              mark:
 *                type: string
 *              model:
 *                type: string
 *              referenc:
 *                type: string
 *              discount:
 *                type: number
 *              status:
 *                type: boolean
 *              origin:
 *                type: string
 *              buy_tax:
 *                type: number
 *              sale_tax:
 *                type: number
 *              products_units:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    unit:
 *                      type: string
 *                    cost:
 *                      type: number
 *                    price:
 *                      type: number
 *            required:
 *              - code
 *              - description
 *              - mark
 *              - model
 *              - referenc
 *              - origin
 *              - buy_tax
 *              - sale_tax
 *              - products_units
 *  
 *     responses:
 *       200:
 *         description: Retorna el producto creado
 *       400:
 *         description: Error de validación del body
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 * /products/{id}:
 *   get:
 *     description: Devuelve un producto por su código
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Retorna el producto encontrado con sus unidades y stock
 *       400:
 *         description: Parámetro inválido
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 *   put:
 *     description: Actualiza un producto existente con los datos proporcionados
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *              mark:
 *                type: string
 *              model:
 *                type: string
 *              referenc:
 *                type: string
 *              discount:
 *                type: number
 *              status:
 *                type: boolean
 *              origin:
 *                type: string
 *              buy_tax:
 *                type: number
 *              sale_tax:
 *                type: number
 *              products_units:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: number
 *                    unit:
 *                      type: string
 *                    cost:
 *                      type: number
 *                    price:
 *                      type: number
 *           required:
 *            - products_units.correlative
 *     responses:
 *       201:
 *         description: Retorna el producto actualizado
 *       404:
 *         description: Producto no encontrado
 *       400:
 *         description: Solicitud inválida
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 *   delete:
 *      description: Elimina un producto existente
 *      tags:
 *        - Productos
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: number
 *      responses:
 *        200:
 *          description: Retorna el mensaje de que se ha eliminado el producto
 *        400:
 *          description: Parámetro inválido
 *        401:
 *          description: No autorizado
 *        404:
 *          description: Producto no encontrado
 *        500:
 *          description: Error interno del servidor
 *      security:
 *        - bearerAuth: []
 */
route.get("/products", productsController.getAll);
route.get("/products/:id", productsController.getOne);
route.post("/products", productsController.create);
route.put("/products/:id", productsController.update);
route.delete("/products/:id", productsController.delete);

export default route;
