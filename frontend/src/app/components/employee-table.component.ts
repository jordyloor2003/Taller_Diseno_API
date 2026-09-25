import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="card table-card">
      <div class="card-header table-header">
        <div>
          <h2>Directorio del Personal</h2>
          <p class="subtitle">Visualización reactiva en tiempo real del equipo</p>
        </div>
        <div class="badge badge-count">
          <span>{{ employees.length }}</span>
          {{ employees.length === 1 ? 'Empleado' : 'Empleados' }}
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Puesto / Cargo</th>
              <th>Departamento</th>
              <th>Sueldo</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (employee of employees; track employee.id) {
              <tr class="table-row">
                <td>
                  <div class="collab-cell">
                    <div class="avatar-circle">
                      {{ getInitials(employee.nombre) }}
                    </div>
                    <div>
                      <div class="emp-name">{{ employee.nombre }}</div>
                      <div class="emp-id">ID: {{ employee.id.slice(-6) }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="role-badge">{{ employee.cargo }}</span>
                </td>
                <td>
                  <span class="dept-tag">{{ employee.departamento }}</span>
                </td>
                <td>
                  <span class="salary-value">{{ employee.sueldo | currency:'USD':'symbol':'1.2-2' }}</span>
                </td>
                <td class="text-right">
                  <div class="action-buttons">
                    <button
                      type="button"
                      class="btn-action btn-edit"
                      (click)="edit.emit(employee)"
                      title="Editar empleado"
                      [id]="'btn-edit-' + employee.id"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Editar
                    </button>
                    <button
                      type="button"
                      class="btn-action btn-delete"
                      (click)="remove.emit(employee.id)"
                      title="Eliminar empleado"
                      [id]="'btn-delete-' + employee.id"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr class="empty-row">
                <td colspan="5">
                  <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <h3>Sin empleados registrados</h3>
                    <p>Utilice el formulario para registrar al primer miembro del equipo.</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class EmployeeTableComponent {
  @Input() employees: readonly Employee[] = [];
  @Output() readonly edit = new EventEmitter<Employee>();
  @Output() readonly remove = new EventEmitter<string>();

  getInitials(name: string): string {
    if (!name) return '??';
    return name
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
}
