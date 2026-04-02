import { Router } from "express";
import { authController } from "@/containers";

const route = Router();
/**
 * @openapi
 * /signin:
 *   post:
 *     description: Inicia sesion con codigo de usuario y contraseña, devuelve el JWT si las credenciales son validas
 *     tags:
 *      - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              code:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - code
 *              - password
 *     responses:
 *       200:
 *         description: Retorna el token si las credenciales son validas
 */
route.post("/signin", authController.signIn);

export default route;
