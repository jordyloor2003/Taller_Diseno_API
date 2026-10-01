import type { Request, Response } from 'express';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { ZodError, z } from 'zod';
import { errorHandler, HttpError } from './error-handler.js';

describe('🧪 Unit Test: Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let nextMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock as any,
      json: jsonMock as any,
      locals: {},
    };
    mockRequest = {};
    nextMock = jest.fn();
  });

  it('Debería manejar un ZodError retornando status 400 y mensaje de datos inválidos', () => {
    const dummySchema = z.object({ age: z.number() });
    let zodError: ZodError | null = null;
    try {
      dummySchema.parse({ age: 'invalid' });
    } catch (err) {
      zodError = err as ZodError;
    }

    errorHandler(zodError, mockRequest as Request, mockResponse as Response, nextMock);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          message: 'Datos inválidos',
        }),
      }),
    );
  });

  it('Debería manejar un HttpError retornando su status personalizado y mensaje', () => {
    const httpError = new HttpError(404, 'Empleado no encontrado');

    errorHandler(httpError, mockRequest as Request, mockResponse as Response, nextMock);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: { message: 'Empleado no encontrado' },
    });
  });

  it('Debería manejar un error no controlado retornando status 500 y mensaje genérico', () => {
    const unhandledError = new Error('Database connection failed');

    errorHandler(unhandledError, mockRequest as Request, mockResponse as Response, nextMock);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: { message: 'Error interno del servidor' },
    });
  });
});
