import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate<T>(schema: ZodSchema<T>, property: "body" | "query" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = (req as Record<string, unknown>)[property];
    const result = schema.safeParse(data);
    if (!result.success) {
      const issue = result.error.issues[0];
      res
        .status(400)
        .json({ message: issue.message, field: issue.path.join(".") });
      return;
    }
    (req as Record<string, unknown>)[property] = result.data;
    next();
  };
}
