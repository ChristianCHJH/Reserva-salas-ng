import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReservasModule } from './features/reservas/reservas.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReservasModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Reservas de Salas';
}
