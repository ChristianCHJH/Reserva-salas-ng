import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Reserva, Sala } from '@core/models';

@Injectable({
    providedIn: 'root'
})
export class ReservasService {
    private apiUrl = `${environment.apiBaseUrl}/reservas`;

    constructor(private http: HttpClient) {}

    obtenerReservas(): Observable<Reserva[]> {
        return this.http
            .get<Reserva[] | { data?: Reserva[] }>(this.apiUrl)
            .pipe(
                map((res) => (Array.isArray(res) ? res : res?.data ?? [])),
                catchError((err) => {
                    console.error('Error HTTP reservas', err);
                    return of([] as Reserva[]);
                })
            );
    }

    obtenerSalas(): Observable<Sala[]> {
        const url = `${environment.apiBaseUrl}/salas`;
        return this.http.get<Sala[] | { data?: Sala[] }>(url).pipe(
            map((res) => (Array.isArray(res) ? res : res?.data ?? [])),
            catchError((err) => {
                console.error('Error al listar salas', err);
                return of([] as Sala[]);
            })
        );
    }

    crearReserva(payload: {
        inicio: string;
        fin: string;
        titulo: string;
        descripcion: string;
        salaId: string;
        usuarioId: string;
    }): Observable<Reserva> {
        return this.http.post<Reserva>(this.apiUrl, payload);
    }

    obtenerSalasDisponibles(inicio?: string, fin?: string): Observable<Sala[]> {
        const base = `${environment.apiBaseUrl}/salas`;
        const url = inicio && fin ? `${base}/disponibles` : base;
        let params = new HttpParams();
        if (inicio && fin) {
            params = params.set('inicio', inicio).set('fin', fin);
        }
        return this.http.get<Sala[] | { data?: Sala[] }>(url, { params }).pipe(
            map((res) => (Array.isArray(res) ? res : res?.data ?? [])),
            catchError((err) => {
                console.error('Error al obtener salas', err);
                return of([] as Sala[]);
            })
        );
    }
}
