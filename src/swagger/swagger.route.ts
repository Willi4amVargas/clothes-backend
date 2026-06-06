import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  apis: ["./src/**/*.docs.yaml"],
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

const uiOptions = {
  customCssUrl: 'https://erp.widvu.com/api/docs/swagger-ui.css',
  customJs: [
    'https://erp.widvu.com/api/docs/swagger-ui-bundle.js',
    'https://erp.widvu.com/api/docs/swagger-ui-standalone-preset.js'
  ],
};

// CAMBIO CRUCIAL: Se usa .use() para ambos y se pasan las opciones en el setup()
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, uiOptions));

export default router;
