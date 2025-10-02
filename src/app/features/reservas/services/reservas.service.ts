import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Reserva } from '@core/models';

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
}
