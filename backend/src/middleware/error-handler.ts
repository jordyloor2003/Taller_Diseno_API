import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(public readonly status: number, message: string, public readonly details?: unknown) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  res.locals.skipResponseWrapper = true;
  if (error instanceof ZodError) {
    res.status(400).json({ success: false, error: { message: 'Datos inválidos', details: error.flatten() } });
    return;
  }
  const status = error instanceof HttpError ? error.status : 500;
  const message = error instanceof HttpError ? error.message : 'Error interno del servidor';
  res.status(status).json({ success: false, error: { message, ...(error instanceof HttpError && error.details ? { details: error.details } : {}) } });
};