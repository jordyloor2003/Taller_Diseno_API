import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, tap } from 'rxjs';
import { Employee, EmployeeInput } from '../models/employee.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/v1/empleados';
  private readonly employeesSubject = new BehaviorSubject<readonly Employee[]>([]);
  readonly employees$ = this.employeesSubject.asObservable();

  constructor() {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.http.get<ApiResponse<Employee[]>>(this.apiUrl).pipe(
      tap(({ data }) => this.employeesSubject.next([...data])),
      catchError((err) => {
        console.error('Error al cargar empleados:', err);
        return EMPTY;
      }),
    ).subscribe();
  }

  addEmployee(employee: EmployeeInput): void {
    this.http.post<ApiResponse<Employee>>(this.apiUrl, employee).pipe(
      tap(({ data }) => {
        const current = this.employeesSubject.value;
        this.employeesSubject.next([...current, data]);
      }),
      catchError((err) => {
        console.error('Error al registrar empleado:', err);
        return EMPTY;
      }),
    ).subscribe();
  }

  updateEmployee(id: string, changes: Partial<EmployeeInput>): void {
    this.http.put<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, changes).pipe(
      tap(({ data }) => {
        const current = this.employeesSubject.value;
        this.employeesSubject.next(current.map((employee) => employee.id === id ? data : employee));
      }),
      catchError((err) => {
        console.error('Error al actualizar empleado:', err);
        return EMPTY;
      }),
    ).subscribe();
  }

  deleteEmployee(id: string): void {
    this.http.delete<ApiResponse<{ id: string } | null>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.employeesSubject.value;
        this.employeesSubject.next(current.filter((employee) => employee.id !== id));
      }),
      catchError((err) => {
        console.error('Error al eliminar empleado:', err);
        return EMPTY;
      }),
    ).subscribe();
  }
}
