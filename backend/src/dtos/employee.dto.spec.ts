import { describe, expect, it } from '@jest/globals';
import {
  employeeCreateSchema,
  employeeUpdateSchema,
  employeeIdSchema,
} from './employee.dto.js';

describe('🧪 Unit Test: Employee DTO Validation (Zod Schemas)', () => {
  describe('employeeCreateSchema (Creación)', () => {
    it('Debería validar correctamente un payload válido con nombre de al menos 3 letras', () => {
      const validData = {
        nombre: 'Andrés Mendoza',
        cargo: 'Software Architect',
        departamento: 'I+D',
        sueldo: 4200,
      };

      const result = employeeCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nombre).toBe('Andrés Mendoza');
      }
    });

    it('Debería rechazar si falta el campo obligatorio nombre', () => {
      const invalidData = {
        cargo: 'Developer',
        departamento: 'TI',
        sueldo: 3000,
      };

      const result = employeeCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('Debería rechazar un nombre menor a 3 caracteres (ej: 2 letras)', () => {
      const invalidData = {
        nombre: 'Al',
        cargo: 'Developer',
        departamento: 'TI',
        sueldo: 3000,
      };

      const result = employeeCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('Debería rechazar nombres que contengan números o caracteres especiales', () => {
      const invalidDataNumbers = {
        nombre: 'Carlos123',
        cargo: 'Developer',
        departamento: 'TI',
        sueldo: 3000,
      };
      const invalidDataSymbols = {
        nombre: 'Ana_María!',
        cargo: 'Developer',
        departamento: 'TI',
        sueldo: 3000,
      };

      expect(employeeCreateSchema.safeParse(invalidDataNumbers).success).toBe(false);
      expect(employeeCreateSchema.safeParse(invalidDataSymbols).success).toBe(false);
    });

    it('Debería rechazar sueldos negativos', () => {
      const invalidData = {
        nombre: 'Andrés Mendoza',
        cargo: 'Software Architect',
        departamento: 'I+D',
        sueldo: -500,
      };

      const result = employeeCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('Debería rechazar propiedades adicionales no permitidas (modo strict)', () => {
      const invalidData = {
        nombre: 'Andrés Mendoza',
        cargo: 'Software Architect',
        departamento: 'I+D',
        sueldo: 4200,
        extraProp: 'no_permitido',
      };

      const result = employeeCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('employeeUpdateSchema (Actualización)', () => {
    it('Debería permitir actualizar un subconjunto de campos', () => {
      const partialData = {
        sueldo: 5000,
      };

      const result = employeeUpdateSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it('Debería validar el nombre si se incluye en la actualización', () => {
      const invalidNameUpdate = { nombre: 'Lu12' };
      expect(employeeUpdateSchema.safeParse(invalidNameUpdate).success).toBe(false);

      const validNameUpdate = { nombre: 'Lucía Gómez' };
      expect(employeeUpdateSchema.safeParse(validNameUpdate).success).toBe(true);
    });

    it('Debería rechazar un objeto vacío sin ningún campo para actualizar', () => {
      const emptyData = {};

      const result = employeeUpdateSchema.safeParse(emptyData);
      expect(result.success).toBe(false);
    });
  });

  describe('employeeIdSchema (Validación de ObjectId)', () => {
    it('Debería aceptar un ObjectId hexadecimal válido de 24 caracteres', () => {
      const validId = { id: '65f1a2b3c4d5e6f7a8b9c0d1' };

      const result = employeeIdSchema.safeParse(validId);
      expect(result.success).toBe(true);
    });

    it('Debería rechazar un ID con formato inválido o caracteres no hexadecimales', () => {
      const invalidId = { id: 'id-invalido-123' };

      const result = employeeIdSchema.safeParse(invalidId);
      expect(result.success).toBe(false);
    });
  });
});
