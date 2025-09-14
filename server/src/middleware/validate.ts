import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate<T>(schema: ZodSchema<T>, property: "body" | "query" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = (req as Record<string, unknown>)[property];
    const result = schema.safeParse(data);
    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() });
      return;
    }
    (req as Record<string, unknown>)[property] = result.data;
    next();
  };
}
