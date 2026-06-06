import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  apis: ["./src/**/*.docs.yaml"],
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
  ],
  definition: {
    components: {
      securitySchemes: {
        bearerAuth: {
          bearerFormat: "JWT",
          scheme: "bearer",
          type: "http",
        },
      },
    },
    info: {
      title: "API Tienda Comercial",
      version: "1.0.0",
    },
    openapi: "3.0.0",
    schemes: ["http"],
    servers: [
      {
        description: "Servidor actual",
        url: "/api",
      }
    ],
    tags: [
      {
        description: "Endpoints para manejo de sesiones y tokens JWT",
        name: "Autenticación",
      },
      {
        description: "Gestión de productos y unidades",
        name: "Productos",
      },
      {
        description: "Operaciones relacionadas con el inventario",
        name: "Inventario",
      },
      {
        description: "Operaciones relacionadas con las ventas",
        name: "Ventas",
      },
      {
        description: "Operaciones relacionadas con las compras",
        name: "Compras",
      },
    ],
  }
};

const router = Router();
const swaggerSpec = swaggerJsdoc(options);

router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(swaggerSpec));

export default router;
