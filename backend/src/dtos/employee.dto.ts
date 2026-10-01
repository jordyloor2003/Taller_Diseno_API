import { z } from 'zod';

const nameLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

export const nombreSchema = z
  .string({ required_error: 'El nombre es obligatorio' })
  .trim()
  .min(3, 'El nombre debe tener al menos 3 letras')
  .max(100, 'El nombre no puede exceder 100 caracteres')
  .regex(nameLettersRegex, 'El nombre solo debe contener letras');

const text = z.string().trim().min(2).max(100);

export const employeeCreateSchema = z.object({
  nombre: nombreSchema,
  cargo: text,
  departamento: text,
  sueldo: z.number({ required_error: 'El sueldo es obligatorio' }).finite().nonnegative('El sueldo no puede ser negativo'),
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