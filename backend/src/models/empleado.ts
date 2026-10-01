import { Schema, model, type HydratedDocument } from 'mongoose';

export interface Employee {
  id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type EmployeeDocument = HydratedDocument<Omit<Employee, 'id'>>;

const empleadoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo debe contener letras'],
    },
    cargo: { type: String, required: true, trim: true, minlength: 2 },
    departamento: { type: String, required: true, trim: true, minlength: 2 },
    sueldo: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const EmployeeModel = model('Empleado', empleadoSchema);