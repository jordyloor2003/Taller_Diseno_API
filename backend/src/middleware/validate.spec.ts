import type { Request, Response } from 'express';
import { describe, expect, it, jest } from '@jest/globals';
import { z, ZodError } from 'zod';
import { validate } from './validate.js';

describe('🧪 Unit Test: Validate Middleware', () => {
  const schema = z.object({
    nombre: z.string().min(2),
    sueldo: z.number().nonnegative(),
  });

  it('Debería invocar next() sin errores cuando la carga útil es válida', () => {
    const middleware = validate('body', schema);
    const req = {
      body: { nombre: 'Andrés Mendoza', sueldo: 4000 },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ nombre: 'Andrés Mendoza', sueldo: 4000 });
  });

  it('Debería pasar un ZodError a next(error) cuando la carga útil es inválida', () => {
    const middleware = validate('body', schema);
    const req = {
      body: { nombre: 'A', sueldo: -100 },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0]?.[0]).toBeInstanceOf(ZodError);
  });
});
