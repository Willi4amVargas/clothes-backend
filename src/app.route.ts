import { Router } from "express";
import { appController } from "@/containers";

export const route = Router();

/**
 * @openapi
 * /:
 *   get:
 *     description: Mensaje de bienvenida de la API
 *     responses:
 *       200:
 *         description: Devueve un mensage misterioso
 */
route.get("/", appController.get);

export default route;
