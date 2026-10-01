import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<readonly ToastMessage[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();

  show(type: ToastMessage['type'], title: string, message: string, durationMs = 4500): void {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const toast: ToastMessage = {
      id,
      type,
      title,
      message,
      timestamp: new Date(),
    };

    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    if (durationMs > 0) {
      setTimeout(() => this.remove(id), durationMs);
    }
  }

  success(title: string, message: string): void {
    this.show('success', title, message);
  }

  error(title: string, message: string): void {
    this.show('error', title, message, 6000);
  }

  info(title: string, message: string): void {
    this.show('info', title, message);
  }

  warning(title: string, message: string): void {
    this.show('warning', title, message);
  }

  remove(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
  }
}
