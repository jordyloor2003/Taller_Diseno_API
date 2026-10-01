import type { Request, Response } from 'express';
import { HttpError } from '../../../middleware/error-handler.js';
import type { IEmployeeRepository } from '../repositories/employee.repository.interface.js';

export class EmployeeController {
  constructor(private readonly repository: IEmployeeRepository) {}

  getEmployees = async (_req: Request, res: Response): Promise<void> => {
    const employees = await this.repository.findAll();
    res.status(200).json(employees);
  };

  createEmployee = async (req: Request, res: Response): Promise<void> => {
    const created = await this.repository.create(req.body);
    res.status(201).json(created);
  };

  updateEmployee = async (req: Request, res: Response): Promise<void> => {
    const id = req.params?.id;
    if (typeof id !== 'string') {
      throw new HttpError(400, 'El id es obligatorio');
    }
    const employee = await this.repository.update(id, req.body);
    if (!employee) {
      throw new HttpError(404, 'Empleado no encontrado');
    }
    res.status(200).json(employee);
  };

  deleteEmployee = async (req: Request, res: Response): Promise<void> => {
    const id = req.params?.id;
    if (typeof id !== 'string') {
      throw new HttpError(400, 'El id es obligatorio');
    }
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new HttpError(404, 'Empleado no encontrado');
    }
    res.status(200).json({ id });
  };
}

export const createEmployeeController = (repository: IEmployeeRepository) => new EmployeeController(repository);
