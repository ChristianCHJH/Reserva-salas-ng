import { routes } from './app.routes';
import { ReservasComponent } from '@features/reservas/components/reservas.component';

describe('App Routes', () => {
  it('should have default redirect to reservas', () => {
    const root = routes.find(r => r.path === '');
    expect(root).toBeDefined();
    expect(root?.redirectTo).toBe('reservas');
    expect(root?.pathMatch).toBe('full');
  });

  it('should map /reservas to ReservasComponent', () => {
    const r = routes.find(r => r.path === 'reservas');
    expect(r?.component).toBe(ReservasComponent);
  });
});

