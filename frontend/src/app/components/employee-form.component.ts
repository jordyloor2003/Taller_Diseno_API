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
        <div class="card-header-icon" [class.editing-icon]="isEditing">
          @if (isEditing) {
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          } @else {
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
          }
        </div>
        <div>
          <h2>{{ isEditing ? 'Editar Colaborador' : 'Registrar Colaborador' }}</h2>
          <p class="subtitle">{{ isEditing ? 'Modifique los campos necesarios y guarde los cambios' : 'Complete los datos requeridos para registrar en la nómina' }}</p>
        </div>
      </div>

      <form (ngSubmit)="submit(employeeForm)" #employeeForm="ngForm" class="employee-form" novalidate>
        <!-- Campo Nombre -->
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
              minlength="3"
              pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$"
              #nombreField="ngModel"
              [class.input-error]="nombreField.invalid && (nombreField.dirty || nombreField.touched)"
              [class.input-valid]="nombreField.valid && (nombreField.dirty || nombreField.touched)"
            />
          </div>
          @if (nombreField.invalid && (nombreField.dirty || nombreField.touched)) {
            <div class="error-container">
              @if (nombreField.errors?.['required']) {
                <span class="error-text">⚠️ El nombre es obligatorio.</span>
              } @else if (nombreField.errors?.['minlength']) {
                <span class="error-text">⚠️ El nombre debe tener al menos 3 letras.</span>
              } @else if (nombreField.errors?.['pattern']) {
                <span class="error-text">⚠️ Solo se permiten letras y espacios (sin números ni símbolos).</span>
              }
            </div>
          }
        </div>

        <!-- Campo Cargo -->
        <div class="form-group">
          <label for="emp-cargo">
            <span>Cargo / Posición</span>
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
              [class.input-valid]="cargoField.valid && (cargoField.dirty || cargoField.touched)"
            />
          </div>
          @if (cargoField.invalid && (cargoField.dirty || cargoField.touched)) {
            <div class="error-container">
              @if (cargoField.errors?.['required']) {
                <span class="error-text">⚠️ El cargo es obligatorio.</span>
              } @else if (cargoField.errors?.['minlength']) {
                <span class="error-text">⚠️ El cargo debe tener al menos 2 caracteres.</span>
              }
            </div>
          }
        </div>

        <!-- Campo Departamento -->
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
              [class.input-valid]="deptField.valid && (deptField.dirty || deptField.touched)"
            />
          </div>
          @if (deptField.invalid && (deptField.dirty || deptField.touched)) {
            <div class="error-container">
              @if (deptField.errors?.['required']) {
                <span class="error-text">⚠️ El departamento es obligatorio.</span>
              } @else if (deptField.errors?.['minlength']) {
                <span class="error-text">⚠️ El departamento debe tener al menos 2 caracteres.</span>
              }
            </div>
          }
        </div>

        <!-- Campo Sueldo -->
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
              [class.input-valid]="sueldoField.valid && (sueldoField.dirty || sueldoField.touched)"
            />
          </div>
          @if (sueldoField.invalid && (sueldoField.dirty || sueldoField.touched)) {
            <div class="error-container">
              @if (sueldoField.errors?.['required']) {
                <span class="error-text">⚠️ El sueldo es obligatorio.</span>
              } @else if (sueldoField.errors?.['min'] || form.sueldo < 0) {
                <span class="error-text">⚠️ Ingrese un sueldo positivo o cero (no negativo).</span>
              }
            </div>
          }
        </div>

        <!-- Botones de Acción -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="employeeForm.invalid"
            id="btn-submit-employee"
          >
            @if (isEditing) {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Guardar Cambios
            } @else {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Registrar Empleado
            }
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
    const sanitizedData: EmployeeInput = {
      nombre: this.form.nombre.trim(),
      cargo: this.form.cargo.trim(),
      departamento: this.form.departamento.trim(),
      sueldo: Number(this.form.sueldo),
    };

    if (this.isEditing && this.editingId) {
      this.updated.emit({ id: this.editingId, data: sanitizedData });
    } else {
      this.submitted.emit(sanitizedData);
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
