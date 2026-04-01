import { NextFunction, Request, Response } from "express";
import { AuthService } from "@/auth/auth.service";
import { publicRoutes } from "@/config/publicRoutes";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { url, method } = req;
  // el manejo de las rutas publicas puede hacerse mejor pero por ahora se quedara asi
  const isPublicRoute = publicRoutes.some(
    (r) =>
      r.route.toLowerCase() === url.toLowerCase() &&
      r.method.toLowerCase() === method.toLowerCase(),
  );

  if (isPublicRoute) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = await AuthService.verifyToken(token);
    res.locals.user = payload;
    return next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
