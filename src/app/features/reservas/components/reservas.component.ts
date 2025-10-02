import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../services/reservas.service';
import { Reserva } from '@core/models';
import { CalendarOptions } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getColorStyles } from '@core/constants/colors';
import { ES_CALENDAR_LOCALE } from '@core/constants/locale';
import { MessageService } from 'primeng/api';
import { Sala } from '@core/models';

@Component({
    selector: 'app-reservas',
    templateUrl: './reservas.component.html',
    styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {
    reservas: Reserva[] = [];
    vista: 'listado' | 'calendario' = 'listado';
    opcionesVista = [
        { label: '', value: 'calendario', icon: 'pi pi-calendar' },
        { label: '', value: 'listado', icon: 'pi pi-list' }
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
    calendarLocale = ES_CALENDAR_LOCALE;

    constructor(private reservasService: ReservasService, private messageService: MessageService) {}

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

    mostrarModal = false;
    selectedDate?: Date;
    startTime?: Date;
    endTime?: Date;
    inicio?: Date;
    fin?: Date;
    titulo = '';
    descripcion = '';
    salaId: string | null = null;
    usuarioId = '1';
    salas: Sala[] = [];
    cargandoSalas = false;

    timeStep: 15 | 30 = 15;
    timeOptions: { label: string; value: string }[] = [];
    startTimeText = '';
    endTimeText = '';

    abrirModal() {
        this.mostrarModal = true;
        this.selectedDate = undefined;
        this.startTime = undefined;
        this.endTime = undefined;
        this.inicio = undefined;
        this.fin = undefined;
        this.titulo = '';
        this.descripcion = '';
        this.salaId = null;
        this.salas = [];
        this.timeStep = 15;
        this.timeOptions = this.generateTimeOptions(this.timeStep);
        const now = new Date();
        const startSugerida = this.roundUpToStep(now, this.timeStep);
        const finSugerida = new Date(startSugerida.getTime() + 60 * 60 * 1000);
        this.startTimeText = this.formatHHmm(startSugerida.getHours(), startSugerida.getMinutes());
        this.endTimeText = this.formatHHmm(finSugerida.getHours(), finSugerida.getMinutes());
        this.startTime = this.parseHHmm(this.startTimeText);
        this.endTime = this.parseHHmm(this.endTimeText);
        this.reservasService.obtenerSalas().subscribe({ next: s => (this.salas = s) });
    }

    private composeDate(base: Date, time: Date): Date {
        const d = new Date(base);
        d.setHours(time.getHours(), time.getMinutes(), 0, 0);
        return d;
    }

    private generateTimeOptions(step: 15 | 30): { label: string; value: string }[] {
        const opts: { label: string; value: string }[] = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += step) {
                const label = this.formatHHmm(h, m);
                opts.push({ label, value: label });
            }
        }
        return opts;
    }

    private formatHHmm(h: number, m: number) {
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        return `${hh}:${mm}`;
    }

    private roundUpToStep(date: Date, step: 15 | 30): Date {
        const d = new Date(date);
        const minutes = d.getMinutes();
        const remainder = minutes % step;
        const diff = remainder === 0 ? 0 : step - remainder;
        d.setMinutes(minutes + diff, 0, 0);
        return d;
    }

    private parseHHmm(text: string): Date | undefined {
        const match = /^\s*(\d{1,2}):(\d{2})\s*$/.exec(text ?? '');
        if (!match) return undefined;
        let h = Number(match[1]);
        let m = Number(match[2]);
        if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return undefined;
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
    }

    onCambiarStep(step: 15 | 30) {
        this.timeStep = step;
        this.timeOptions = this.generateTimeOptions(step);
    }

    onTimeTextChange() {
        this.startTime = this.parseHHmm(this.startTimeText);
        this.endTime = this.parseHHmm(this.endTimeText);
        this.onFechaHoraChange();
    }

    onFechaHoraChange() {
        if (!this.selectedDate || !this.startTime || !this.endTime) {
            this.inicio = undefined;
            this.fin = undefined;
            this.salas = [];
            return;
        }
        this.inicio = this.composeDate(this.selectedDate, this.startTime);
        this.fin = this.composeDate(this.selectedDate, this.endTime);
    }

    crearReserva() {
        if (!this.inicio || !this.fin || !this.titulo?.trim() || !this.salaId) {
            this.messageService.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Completa todos los campos para continuar.' });
            return;
        }
        if (this.titulo.length > 140) {
            this.messageService.add({ severity: 'warn', summary: 'Título muy largo', detail: 'Máximo permitido: 140 caracteres.' });
            return;
        }
        if (this.fin <= this.inicio) {
            this.messageService.add({ severity: 'warn', summary: 'Rango inválido', detail: 'La hora de fin debe ser mayor que la de inicio.' });
            return;
        }
        const payload = {
            inicio: this.inicio.toISOString(),
            fin: this.fin.toISOString(),
            titulo: this.titulo,
            descripcion: this.descripcion,
            salaId: this.salaId,
            usuarioId: this.usuarioId
        };
        this.reservasService.crearReserva(payload).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Reserva creada', detail: 'La reserva fue creada correctamente.' });
                this.mostrarModal = false;
                this.cargarReservas();
            },
            error: (err) => {
                const detail = err?.error?.message || 'No se pudo crear la reserva.';
                this.messageService.add({ severity: 'error', summary: 'Error', detail });
            }
        });
    }
}
