import { EmployeeModel, type Employee } from '../models/empleado.js';
import type { IEmployeeRepository, NewEmployee } from './employee.repository.js';

const toEmployee = (document: { _id: unknown; toObject(): Record<string, unknown> }): Employee => {
  const value = document.toObject();
  return { ...value, id: String(document._id) } as Employee;
};

export class MongooseEmployeeRepository implements IEmployeeRepository {
  async findAll(): Promise<Employee[]> {
    const employees = await EmployeeModel.find().sort({ createdAt: -1 }).exec();
    return employees.map(toEmployee);
  }

  async create(employee: NewEmployee): Promise<Employee> {
    const created = await EmployeeModel.create(employee);
    return toEmployee(created);
  }

  async update(id: string, employee: Partial<NewEmployee>): Promise<Employee | null> {
    const updated = await EmployeeModel.findByIdAndUpdate(id, employee, {
      returnDocument: 'after',
      runValidators: true,
    }).exec();
    return updated ? toEmployee(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await EmployeeModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}