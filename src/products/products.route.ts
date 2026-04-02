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
 *              short_name:
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
 *                    main_unit:
 *                      type: boolean
 *                    cost:
 *                      type: number
 *                    price:
 *                      type: number
 *            required:
 *              - code
 *              - description
 *              - short_name
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
 *     security:
 *       - bearerAuth: []
 * /products/{code}:
 *   get:
 *     description: Devuelve un producto por su código
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retorna el producto encontrado
 *     security:
 *       - bearerAuth: []
 *   put:
 *     description: Actualiza un producto existente con los datos proporcionados
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *              short_name:
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
 *                    main_unit:
 *                      type: boolean
 *                    cost:
 *                      type: number
 *                    price:
 *                      type: number
 *     responses:
 *       200:
 *         description: Retorna el producto actualizado
 *       404:
 *         description: Producto no encontrado
 *       400:
 *         description: Solicitud inválida
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
 *          name: code
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Retorna el mensaje de que se ha eliminado el producto
 *        404:
 *          description: Producto no encontrado
 *        500:
 *          description: Error interno del servidor
 *      security:
 *        - bearerAuth: []
 */
route.get("/products", productsController.getAll);
route.get("/products/:code", productsController.getOne);
route.post("/products", productsController.create);
route.put("/products/:code", productsController.update);
route.delete("/products/:code", productsController.delete);

export default route;
