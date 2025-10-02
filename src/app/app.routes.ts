import { Routes } from '@angular/router';
import { ReservasComponent } from './features/reservas/components/reservas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'reservas', pathMatch: 'full' },
  { path: 'reservas', component: ReservasComponent }
];
