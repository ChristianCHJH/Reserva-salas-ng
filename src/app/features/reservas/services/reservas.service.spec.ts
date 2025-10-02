import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReservasService } from './reservas.service';
import { environment } from '../../../../environments/environment';

describe('ReservasService', () => {
  let service: ReservasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ReservasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('obtenerReservas debe GET a /reservas y mapear respuesta', () => {
    const mock = [{ id: '1', inicio: '', fin: '', titulo: '', descripcion: '', fechaCreacion: '', fechaActualizacion: '', sala: {} as any, usuario: {} as any }];

    let received: any[] = [];
    service.obtenerReservas().subscribe(r => (received = r));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/reservas`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    expect(received.length).toBe(1);
    expect(received[0].id).toBe('1');
  });

  it('obtenerSalas debe GET a /salas y devolver arreglo', () => {
    const salas = [
      { salaId: '1', nombre: 'Sala A', color: 'blue', activa: true, fechaCreacion: '', fechaActualizacion: null },
      { salaId: '2', nombre: 'Sala B', color: 'green', activa: true, fechaCreacion: '', fechaActualizacion: '' }
    ];

    let received: any[] = [];
    service.obtenerSalas().subscribe(r => (received = r));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/salas`);
    expect(req.request.method).toBe('GET');
    req.flush(salas);

    expect(received.length).toBe(2);
    expect(received[0].nombre).toBe('Sala A');
  });

  it('crearReserva debe POST a /reservas y devolver la entidad creada', () => {
    const payload = {
      inicio: new Date().toISOString(),
      fin: new Date(Date.now() + 3600000).toISOString(),
      titulo: 'Reunión',
      descripcion: 'Detalle',
      salaId: '1',
      usuarioId: '1'
    };

    let created: any | undefined;
    service.crearReserva(payload).subscribe(r => (created = r));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/reservas`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    const returned = { id: 'abc', ...payload, sala: {} as any, usuario: {} as any, fechaCreacion: '', fechaActualizacion: '' };
    req.flush(returned);

    expect(created?.id).toBe('abc');
  });

  it('crearReserva debe propagar error del backend', (done) => {
    const payload = {
      inicio: new Date().toISOString(),
      fin: new Date(Date.now() + 3600000).toISOString(),
      titulo: 'Reunión',
      descripcion: 'Detalle',
      salaId: '1',
      usuarioId: '1'
    };

    service.crearReserva(payload).subscribe({
      next: () => done('should not succeed'),
      error: (err) => {
        expect(err.status).toBe(400);
        done();
      }
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/reservas`);
    req.flush({ message: 'Ya existe una reserva que se solapa en ese horario' }, { status: 400, statusText: 'Bad Request' });
  });
});
