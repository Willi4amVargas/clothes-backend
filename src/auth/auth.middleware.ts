import { NextFunction, Request, Response } from "express";

import { AuthService } from "@/auth/auth.service";
import { publicRoutes } from "@/config/publicRoutes";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { method, path } = req;
  const isPublicRoute = publicRoutes.some(publicRoute => {
    const routeRegExp = new RegExp(publicRoute.route);
    return publicRoute.method.toLowerCase() === method.toLowerCase() && routeRegExp.test(path);
  });

  if (isPublicRoute) {
    next(); return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = await AuthService.verifyToken(token);
    res.locals.user = payload;
    next(); return;
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
