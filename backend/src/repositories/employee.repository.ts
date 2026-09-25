import type { Employee } from '../models/empleado.js';

export type NewEmployee = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;

export interface IEmployeeRepository {
  findAll(): Promise<Employee[]>;
  create(employee: NewEmployee): Promise<Employee>;
  update(id: string, employee: Partial<NewEmployee>): Promise<Employee | null>;
  delete(id: string): Promise<boolean>;
}