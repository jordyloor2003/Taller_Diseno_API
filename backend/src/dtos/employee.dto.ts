import { z } from 'zod';

const text = z.string().trim().min(2).max(100);

export const employeeCreateSchema = z.object({
  nombre: text,
  cargo: text,
  departamento: text,
  sueldo: z.number().finite().nonnegative(),
}).strict();

export const employeeUpdateSchema = employeeCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'Debe enviar al menos un campo para actualizar',
);

export const employeeIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'El id debe ser un ObjectId válido'),
});

export type EmployeeCreateDto = z.infer<typeof employeeCreateSchema>;
export type EmployeeUpdateDto = z.infer<typeof employeeUpdateSchema>;