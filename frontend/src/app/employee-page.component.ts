import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EmployeeFormComponent } from './components/employee-form.component';
import { EmployeeTableComponent } from './components/employee-table.component';
import { Employee, EmployeeInput } from './models/employee.model';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [AsyncPipe, EmployeeFormComponent, EmployeeTableComponent],
  template: `
    <div class="page-container">
      <header class="app-header">
        <div class="header-content">
          <div class="brand">
            <div class="brand-badge">ISO/IEC 25010</div>
            <p class="eyebrow">Maestría en Software • Unidad 2</p>
            <h1>Gestión de Personal & Arquitectura de APIs</h1>
          </div>
          <div class="header-stats">
            <div class="stat-pill">
              <span class="stat-dot backend-dot"></span>
              <span>Backend Desacoplado (Repository + Zod)</span>
            </div>
            <div class="stat-pill">
              <span class="stat-dot frontend-dot"></span>
              <span>Frontend Reactivo (RxJS + Smart/Dumb)</span>
            </div>
          </div>
        </div>
      </header>

      <main class="workspace">
        <aside class="sidebar-panel">
          <app-employee-form
            [employee]="selectedEmployee"
            (submitted)="createEmployee($event)"
            (updated)="updateEmployee($event)"
            (cancelled)="selectedEmployee = null"
          />
        </aside>

        <section class="content-panel">
          <app-employee-table
            [employees]="(employees$ | async) ?? []"
            (edit)="selectedEmployee = $event"
            (remove)="deleteEmployee($event)"
          />
        </section>
      </main>
    </div>
  `,
})
export class EmployeePageComponent {
  private readonly employeeService = inject(EmployeeService);
  readonly employees$ = this.employeeService.employees$;

  selectedEmployee: Employee | null = null;

  createEmployee(employee: EmployeeInput): void {
    this.employeeService.addEmployee(employee);
  }

  updateEmployee({ id, data }: { id: string; data: EmployeeInput }): void {
    this.employeeService.updateEmployee(id, data);
    this.selectedEmployee = null;
  }

  deleteEmployee(id: string): void {
    if (this.selectedEmployee?.id === id) {
      this.selectedEmployee = null;
    }
    this.employeeService.deleteEmployee(id);
  }
}
