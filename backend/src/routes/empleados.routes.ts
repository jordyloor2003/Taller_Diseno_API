import { Router } from 'express';
import { createEmployeeController } from '../controllers/empleados.controllers.js';
import { employeeCreateSchema, employeeIdSchema, employeeUpdateSchema } from '../dtos/employee.dto.js';
import type { IEmployeeRepository } from '../repositories/employee.repository.js';
import { validate } from '../middleware/validate.js';

export const createEmployeeRoutes = (repository: IEmployeeRepository): Router => {
	const router = Router();
	const controller = createEmployeeController(repository);

	router.get('/empleados', controller.getEmployees);
	router.post('/empleados', validate('body', employeeCreateSchema), controller.createEmployee);
	router.put('/empleados/:id', validate('params', employeeIdSchema), validate('body', employeeUpdateSchema), controller.updateEmployee);
	router.delete('/empleados/:id', validate('params', employeeIdSchema), controller.deleteEmployee);

	router.get('/employees', controller.getEmployees);
	router.post('/employees', validate('body', employeeCreateSchema), controller.createEmployee);
	router.put('/employees/:id', validate('params', employeeIdSchema), validate('body', employeeUpdateSchema), controller.updateEmployee);
	router.delete('/employees/:id', validate('params', employeeIdSchema), controller.deleteEmployee);

	return router;
};