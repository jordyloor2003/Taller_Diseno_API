import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export const validate = (target: 'body' | 'params', schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      next(result.error);
      return;
    }
    req[target] = result.data;
    next();
  };