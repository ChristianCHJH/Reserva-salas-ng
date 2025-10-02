import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../services/reservas.service';
import { Reserva } from '@core/models';
import { CalendarOptions } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getColorStyles } from '@core/constants/colors';

@Component({
    selector: 'app-reservas',
    templateUrl: './reservas.component.html',
    styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {
    reservas: Reserva[] = [];
    vista: 'listado' | 'calendario' = 'listado';
    opcionesVista = [
        { label: 'Calendario', value: 'calendario' },
        { label: 'Listado', value: 'listado' }
    ];
    opcionesCalendario: CalendarOptions = {
        initialView: 'timeGridWeek',
        locale: esLocale,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        slotMinTime: '08:00:00',
        slotMaxTime: '20:00:00',
        allDaySlot: false,
        height: 'auto',
        events: []
    };

    constructor(private reservasService: ReservasService) {}

    ngOnInit() {
        this.cargarReservas();
    }

    cargarReservas() {
        this.reservasService.obtenerReservas().subscribe({
            next: (data) => {
                this.reservas = data;
                const eventos = data.map(r => ({
                    id: r.id,
                    title: r.titulo,
                    start: r.inicio,
                    end: r.fin,
                    ...this.colorEvento(r.sala?.color),
                    extendedProps: {
                        sala: r.sala?.nombre,
                        usuario: `${r.usuario?.nombres} ${r.usuario?.apellidos}`,
                        descripcion: r.descripcion
                    }
                }));
                this.opcionesCalendario = {
                    ...this.opcionesCalendario,
                    events: eventos
                };
            },
            error: (error) => {
                console.error('Error al cargar las reservas:', error);
            }
        });
    }

    private colorEvento(color?: string) {
        const c = this.obtenerColores(color);
        return {
            backgroundColor: c.bg,
            borderColor: c.border,
            textColor: c.text
        };
    }

    obtenerColores(color?: string) {
        return getColorStyles(color);
    }

    getChipStyle(color?: string) {
        const c = this.obtenerColores(color);
        return { 'background-color': c.bg, color: c.text, 'border-color': c.border };
    }
}
