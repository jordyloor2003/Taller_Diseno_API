import type { RequestHandler } from 'express';
import { HttpError } from '../middleware/error-handler.js';
import type { IEmployeeRepository } from '../repositories/employee.repository.js';

export const createEmployeeController = (repository: IEmployeeRepository) => ({
  getEmployees: (async (_req, res) => {
    res.json(await repository.findAll());
  }) satisfies RequestHandler,

  createEmployee: (async (req, res) => {
    const created = await repository.create(req.body);
    res.status(201).json(created);
  }) satisfies RequestHandler,

  updateEmployee: (async (req, res) => {
    const id = req.params.id;
    if (typeof id !== 'string') {
      throw new HttpError(400, 'El id es obligatorio');
    }
    const employee = await repository.update(id, req.body);
    if (!employee) {
      throw new HttpError(404, 'Empleado no encontrado');
    }
    res.json(employee);
  }) satisfies RequestHandler,

  deleteEmployee: (async (req, res) => {
    const id = req.params.id;
    if (typeof id !== 'string') {
      throw new HttpError(400, 'El id es obligatorio');
    }
    const deleted = await repository.delete(id);
    if (!deleted) {
      throw new HttpError(404, 'Empleado no encontrado');
    }
    res.json({ id });
  }) satisfies RequestHandler,
});
