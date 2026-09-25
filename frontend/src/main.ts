import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { EmployeePageComponent } from './app/employee-page.component';

bootstrapApplication(EmployeePageComponent, {
  providers: [provideHttpClient()],
}).catch((error: unknown) => console.error(error));
