import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

import { redisClient } from "./redis.client";

export const limiter = rateLimit({
  legacyHeaders: false,
  limit: 500, // Límite: Cada IP puede hacer 100 peticiones por ventana
  message: {
    message: "Demasiadas peticiones. Por favor, intenta de nuevo más tarde.",
    status: 429,
  },
  standardHeaders: "draft-7",
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),

  windowMs: 15 * 60 * 1000,
});

export const cacheMiddleware = (durationInSeconds = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        // console.log(`[Caché HIT] Sirviendo: ${cacheKey}`);
        return res.json(JSON.parse(cachedData));
      }

      //   console.log(`[Caché MISS] Buscando datos frescos para: ${cacheKey}`);

      const originalJsonMethod = res.json;

      res.json = function (body) {
        // Restauramos el método original inmediatamente para evitar bucles
        res.json = originalJsonMethod;

        // Si el estado es exitoso (200), guardamos en Redis de fondo
        if (res.statusCode === 200) {
          redisClient
            .setEx(cacheKey, durationInSeconds, JSON.stringify(body))
            .catch((err: any) => {
              console.error("Error guardando en Redis:", err);
            });
        }

        // Finalmente, enviamos la respuesta original al cliente
        return originalJsonMethod.call(this, body);
      };

      // Continuamos al controlador (Controller/Ruta) que consulta la base de datos
      next();
    } catch (error) {
      console.error("Error en el middleware de Redis:", error);
      next();
    }
  };
};
