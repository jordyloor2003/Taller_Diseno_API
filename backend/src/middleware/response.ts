import type { RequestHandler } from 'express';

export const responseWrapper: RequestHandler = (_req, res, next) => {
  const json = res.json.bind(res);
  res.json = (body: unknown) => json(
    res.locals.skipResponseWrapper ? body : { success: true, data: body },
  );
  next();
};