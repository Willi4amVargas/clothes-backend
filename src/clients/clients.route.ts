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
 *     security:
 *       - bearerAuth: []
 */
route.get("/clients", clientsController.getAll);
route.get("/clients/:id", clientsController.getOne);

export default route;
