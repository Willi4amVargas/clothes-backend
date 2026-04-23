import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const dryRun = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { dry_run } = req.query;
  // Si no existe, por defecto es verdadero
  if (dry_run === undefined) {
    res.locals.dry_run = true;
    return next();
  }

  if (typeof dry_run !== "string") {
    return res
      .status(400)
      .json({ message: "Can't send multiples dry_run query params" });
  }

  // Esquema de validación: acepta "true", "false", true o false
  // y lo transforma a un booleano real
  const dryRunSchema = z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
  }, z.boolean());

  const result = dryRunSchema.safeParse(dry_run);

  if (!result.success) {
    // Si existe y no es válido, responder con 400
    return res.status(400).json({
      message: "Query param dry_run must be a valid boolean",
    });
  }

  res.locals.dry_run = result.data;

  return next();
};
