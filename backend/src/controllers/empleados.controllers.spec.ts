import type { Request, Response } from 'express';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { EmployeeController } from './empleados.controllers.js';
import type { IEmployeeRepository } from '../repositories/employee.repository.js';
import { HttpError } from '../middleware/error-handler.js';

describe('🧪 Unit Test: EmployeeController (Mantenibilidad & Testabilidad)', () => {
  let controller: EmployeeController;
  let mockRepository: jest.Mocked<IEmployeeRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    // 1. Crear un Mock 100% aislado de la interfaz (Cero dependencia de Mongoose)
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    controller = new EmployeeController(mockRepository);
    // 2. Mockear los objetos del ciclo de vida de Express
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = { status: statusMock as any, json: jsonMock as any };
  });

  describe('GET /employees (Obtención de empleados)', () => {
    it('Debería retornar un estado 200 y la lista de empleados de la abstracción', async () => {
      const fakeEmployees = [
        { id: '1', nombre: 'Andrés Mendoza', cargo: 'Arquitecto', departamento: 'TI', sueldo: 4000 }
      ];

      mockRepository.findAll.mockResolvedValue(fakeEmployees as any);
      mockRequest = {};
      await controller.getEmployees(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(fakeEmployees);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('Debería retornar un estado 200 y una lista vacía cuando no hay registros', async () => {
      mockRepository.findAll.mockResolvedValue([]);
      mockRequest = {};
      await controller.getEmployees(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([]);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /employees (Creación de empleado)', () => {
    it('Debería retornar un estado 201 y el objeto del empleado creado', async () => {
      const newEmployeeData = {
        nombre: 'Carolina Pérez',
        cargo: 'Tech Lead',
        departamento: 'I+D',
        sueldo: 5500,
      };
      const createdEmployee = { id: 'emp-101', ...newEmployeeData };

      mockRepository.create.mockResolvedValue(createdEmployee as any);
      mockRequest = { body: newEmployeeData };

      await controller.createEmployee(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(createdEmployee);
      expect(mockRepository.create).toHaveBeenCalledWith(newEmployeeData);
    });
  });

  describe('PUT /employees/:id (Actualización de empleado)', () => {
    it('Debería retornar un estado 200 y el empleado actualizado cuando el ID existe', async () => {
      const updateData = { sueldo: 6000 };
      const updatedEmployee = {
        id: 'emp-101',
        nombre: 'Carolina Pérez',
        cargo: 'Tech Lead',
        departamento: 'I+D',
        sueldo: 6000,
      };

      mockRepository.update.mockResolvedValue(updatedEmployee as any);
      mockRequest = {
        params: { id: 'emp-101' },
        body: updateData,
      };

      await controller.updateEmployee(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedEmployee);
      expect(mockRepository.update).toHaveBeenCalledWith('emp-101', updateData);
    });

    it('Debería lanzar un HttpError 404 cuando el empleado no existe para actualizar', async () => {
      mockRepository.update.mockResolvedValue(null);
      mockRequest = {
        params: { id: 'emp-999' },
        body: { sueldo: 6000 },
      };

      await expect(
        controller.updateEmployee(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(new HttpError(404, 'Empleado no encontrado'));
    });

    it('Debería lanzar un HttpError 400 cuando el parámetro ID no es válido o está ausente', async () => {
      mockRequest = {
        params: {} as any,
        body: { sueldo: 6000 },
      };

      await expect(
        controller.updateEmployee(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(new HttpError(400, 'El id es obligatorio'));
    });
  });

  describe('DELETE /employees/:id (Eliminación de empleado)', () => {
    it('Debería retornar un estado 200 con el ID eliminado cuando la eliminación es exitosa', async () => {
      mockRepository.delete.mockResolvedValue(true);
      mockRequest = { params: { id: 'emp-101' } };

      await controller.deleteEmployee(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ id: 'emp-101' });
      expect(mockRepository.delete).toHaveBeenCalledWith('emp-101');
    });

    it('Debería lanzar un HttpError 404 si el empleado a eliminar no existe', async () => {
      mockRepository.delete.mockResolvedValue(false);
      mockRequest = { params: { id: 'emp-999' } };

      await expect(
        controller.deleteEmployee(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(new HttpError(404, 'Empleado no encontrado'));
    });

    it('Debería lanzar un HttpError 400 si el parámetro ID no es válido o está ausente', async () => {
      mockRequest = { params: {} as any };

      await expect(
        controller.deleteEmployee(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(new HttpError(400, 'El id es obligatorio'));
    });
  });
});
