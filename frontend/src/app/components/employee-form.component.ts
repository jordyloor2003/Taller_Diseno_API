import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Employee, EmployeeInput } from '../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="card form-card">
      <div class="card-header">
        <div class="card-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div>
          <h2>{{ isEditing ? 'Editar Empleado' : 'Nuevo Empleado' }}</h2>
          <p class="subtitle">{{ isEditing ? 'Modifique los campos necesarios' : 'Complete los datos para registrar en nómina' }}</p>
        </div>
      </div>

      <form (ngSubmit)="submit(employeeForm)" #employeeForm="ngForm" class="employee-form" novalidate>
        <div class="form-group">
          <label for="emp-nombre">
            <span>Nombre Completo</span>
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <input
              id="emp-nombre"
              name="nombre"
              type="text"
              placeholder="Ej. Andrés Mendoza"
              [(ngModel)]="form.nombre"
              required
              minlength="2"
              #nombreField="ngModel"
              [class.input-error]="nombreField.invalid && (nombreField.dirty || nombreField.touched)"
            />
          </div>
          @if (nombreField.invalid && (nombreField.dirty || nombreField.touched)) {
            <span class="error-text">El nombre debe tener al menos 2 caracteres.</span>
          }
        </div>

        <div class="form-group">
          <label for="emp-cargo">
            <span>Cargo / Puesto</span>
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <input
              id="emp-cargo"
              name="cargo"
              type="text"
              placeholder="Ej. Arquitecto de Software"
              [(ngModel)]="form.cargo"
              required
              minlength="2"
              #cargoField="ngModel"
              [class.input-error]="cargoField.invalid && (cargoField.dirty || cargoField.touched)"
            />
          </div>
          @if (cargoField.invalid && (cargoField.dirty || cargoField.touched)) {
            <span class="error-text">El cargo debe tener al menos 2 caracteres.</span>
          }
        </div>

        <div class="form-group">
          <label for="emp-departamento">
            <span>Departamento</span>
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <input
              id="emp-departamento"
              name="departamento"
              type="text"
              placeholder="Ej. Innovación y Desarrollo"
              [(ngModel)]="form.departamento"
              required
              minlength="2"
              #deptField="ngModel"
              [class.input-error]="deptField.invalid && (deptField.dirty || deptField.touched)"
            />
          </div>
          @if (deptField.invalid && (deptField.dirty || deptField.touched)) {
            <span class="error-text">El departamento debe tener al menos 2 caracteres.</span>
          }
        </div>

        <div class="form-group">
          <label for="emp-sueldo">
            <span>Sueldo Mensual (USD)</span>
            <span class="required">*</span>
          </label>
          <div class="input-wrapper prefix">
            <span class="currency-prefix">$</span>
            <input
              id="emp-sueldo"
              name="sueldo"
              type="number"
              placeholder="0.00"
              min="0"
              [(ngModel)]="form.sueldo"
              required
              #sueldoField="ngModel"
              [class.input-error]="sueldoField.invalid && (sueldoField.dirty || sueldoField.touched)"
            />
          </div>
          @if (sueldoField.invalid && (sueldoField.dirty || sueldoField.touched)) {
            <span class="error-text">Ingrese un sueldo válido no negativo.</span>
          }
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="employeeForm.invalid"
            id="btn-submit-employee"
          >
            {{ isEditing ? 'Guardar Cambios' : 'Registrar Empleado' }}
          </button>
          
          @if (isEditing) {
            <button
              type="button"
              class="btn btn-secondary"
              (click)="cancel(employeeForm)"
              id="btn-cancel-edit"
            >
              Cancelar
            </button>
          }
        </div>
      </form>
    </div>
  `,
})
export class EmployeeFormComponent {
  @ViewChild('employeeForm') private readonly employeeFormDirective?: NgForm;

  @Input() set employee(value: Employee | null) {
    if (value) {
      this.editingId = value.id;
      this.form = {
        nombre: value.nombre,
        cargo: value.cargo,
        departamento: value.departamento,
        sueldo: value.sueldo,
      };
      this.employeeFormDirective?.resetForm({ ...this.form });
    } else {
      this.reset();
    }
  }

  @Output() readonly submitted = new EventEmitter<EmployeeInput>();
  @Output() readonly updated = new EventEmitter<{ id: string; data: EmployeeInput }>();
  @Output() readonly cancelled = new EventEmitter<void>();

  editingId: string | null = null;
  form: EmployeeInput = this.emptyEmployee();

  get isEditing(): boolean {
    return this.editingId !== null;
  }

  submit(formDirective?: NgForm): void {
    if (this.isEditing && this.editingId) {
      this.updated.emit({ id: this.editingId, data: { ...this.form } });
    } else {
      this.submitted.emit({ ...this.form });
    }
    this.reset(formDirective);
  }

  cancel(formDirective?: NgForm): void {
    this.reset(formDirective);
    this.cancelled.emit();
  }

  private reset(formDirective?: NgForm): void {
    this.editingId = null;
    this.form = this.emptyEmployee();
    const directive = formDirective ?? this.employeeFormDirective;
    if (directive) {
      directive.resetForm(this.emptyEmployee());
    }
  }

  private emptyEmployee(): EmployeeInput {
    return { nombre: '', cargo: '', departamento: '', sueldo: 0 };
  }
}
