import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, tap } from 'rxjs';
import { Employee, EmployeeInput } from '../models/employee.model';
import { ToastService } from './toast.service';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://3.140.59.23/api/v1/empleados';
  private readonly toast = inject(ToastService);
  // private readonly apiUrl = 'http://localhost:3000/api/v1/empleados';
  private readonly employeesSubject = new BehaviorSubject<readonly Employee[]>([]);
  readonly employees$ = this.employeesSubject.asObservable();

  constructor() {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.http.get<ApiResponse<Employee[]>>(this.apiUrl).pipe(
      tap(({ data }) => this.employeesSubject.next([...data])),
      catchError((err: HttpErrorResponse) => {
        console.error('Error al cargar empleados:', err);
        this.toast.error(
          'Error de conexión',
          'No se pudo sincronizar el directorio con el backend en http://3.140.59.23/',
        );
        return EMPTY;
      }),
    ).subscribe();
  }

  addEmployee(employee: EmployeeInput): void {
    this.http.post<ApiResponse<Employee>>(this.apiUrl, employee).pipe(
      tap(({ data }) => {
        const current = this.employeesSubject.value;
        this.employeesSubject.next([...current, data]);
        this.toast.success(
          '¡Empleado Registrado! (POST 201)',
          `${data.nombre} fue agregado correctamente a la nómina.`,
        );
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err.error?.error?.message || 'Error al registrar el empleado en la base de datos.';
        this.toast.error('Fallo en Registro (POST)', msg);
        return EMPTY;
      }),
    ).subscribe();
  }

  updateEmployee(id: string, changes: Partial<EmployeeInput>): void {
    this.http.put<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, changes).pipe(
      tap(({ data }) => {
        const current = this.employeesSubject.value;
        this.employeesSubject.next(
          current.map((employee) => (employee.id === id ? data : employee)),
        );
        this.toast.success(
          '¡Empleado Actualizado! (PUT 200)',
          `Los datos de ${data.nombre} se modificaron con éxito.`,
        );
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err.error?.error?.message || 'Error al actualizar el registro.';
        this.toast.error('Fallo en Actualización (PUT)', msg);
        return EMPTY;
      }),
    ).subscribe();
  }

  deleteEmployee(id: string): void {
    const emp = this.employeesSubject.value.find((e) => e.id === id);
    const empName = emp ? emp.nombre : 'El empleado';

    this.http.delete<ApiResponse<{ id: string } | null>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.employeesSubject.value;
        this.employeesSubject.next(current.filter((employee) => employee.id !== id));
        this.toast.info(
          '¡Empleado Eliminado! (DELETE 200)',
          `${empName} fue eliminado del directorio.`,
        );
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err.error?.error?.message || 'No se pudo eliminar el empleado.';
        this.toast.error('Fallo en Eliminación (DELETE)', msg);
        return EMPTY;
      }),
    ).subscribe();
  }
}
