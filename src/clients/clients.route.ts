import { clientsController } from "@/containers";
import { Router } from "express";

const route = Router();

/**
 * @openapi
 * /clients:
 *   get:
 *     description: Devuelve todos los clientes registrados
 *     tags:
 *       - Ventas
 *     responses:
 *       200:
 *         description: Devuelve un listado todos los clientes en la base de datos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 *   post:
 *     description: Crea un cliente nuevo
 *     tags:
 *       - Ventas
 *     parameters:
 *       - in: query
 *         name: dry_run
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *         description: If true, the request will be validated and simulated without persisting changes to the database.
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
 *              client_id:
 *                type: string
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *              country:
 *                type: string
 *              city:
 *                type: string
 *              address:
 *                type: string
 *              credit_days:
 *                type: number
 *              credit_limit:
 *                type: number
 *              discount:
 *                type: number
 *            required:
 *              - code
 *              - description
 *              - client_id
 *              - credit_days
 *              - credit_limit
 *              - discount
 *     responses:
 *       200:
 *         description: Devuelve el cliente creado en la base de datos
 *       400:
 *         description: Error de validación del body
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 * /clients/{id}:
 *   get:
 *     description: Devuelve un cliente por su id
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
 *         description: Retorna el cliente encontrado
 *       400:
 *         description: Parámetro inválido
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 *   put:
 *     description: Actualiza un cliente
 *     tags:
 *       - Ventas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: dry_run
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *         description: If true, the request will be validated and simulated without persisting changes to the database.
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
 *              client_id:
 *                type: string
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *              country:
 *                type: string
 *              city:
 *                type: string
 *              address:
 *                type: string
 *              credit_days:
 *                type: number
 *              credit_limit:
 *                type: number
 *              discount:
 *                type: number
 *     responses:
 *       200:
 *         description: Devuelve el cliente creado en la base de datos
 *       400:
 *         description: Error de validación del body o parámetro
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     description: Elimina un cliente por su id
 *     tags:
 *       - Ventas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: dry_run
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *         description: If true, the request will be validated and simulated without persisting changes to the database.
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente
 *       400:
 *         description: Parámetro inválido
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 */
route.get("/clients", clientsController.getAll);
route.get("/clients/:id", clientsController.getOne);
route.post("/clients", clientsController.create);
route.put("/clients/:id", clientsController.update);
route.delete("/clients/:id", clientsController.delete);

export default route;
