export interface Employee {
  id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: string;
  updatedAt?: string;
}

export type EmployeeInput = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;
