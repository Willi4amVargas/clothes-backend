import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    schemes: ["http"],
    info: {
      title: "API Tienda Comercial",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000/api/",
      },
      {
        url: "http://192.168.0.108:5000/api/",
      },
    ],
    tags: [
      {
        name: "Autenticación",
        description: "Endpoints para manejo de sesiones y tokens JWT",
      },
      {
        name: "Productos",
        description: "Gestión de productos y unidades",
      },
      {
        name: "Inventario",
        description: "Operaciones relacionadas con el inventario",
      },
      {
        name: "Ventas",
        description: "Operaciones relacionadas con las ventas",
      },
      {
        name: "Compras",
        description: "Operaciones relacionadas con las compras",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/**/*.route.ts", "./src/app.route.ts"],
};

const router = Router();
const swaggerSpec = swaggerJsdoc(options);

/**
 * @openapi
 * /docs:
 *   get:
 *     description: Muestra la documentación interactiva de la API
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Documentación Swagger renderizada
 *       500:
 *         description: Error interno del servidor
 */
router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(swaggerSpec));

export default router;
