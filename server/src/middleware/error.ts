import type { Request, Response, NextFunction } from "express";

type AppError = {
  status?: number;
  message?: string;
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const { status = 500, message = "Internal Server Error" } = err as AppError;
  res.status(status).json({ error: message });
}
