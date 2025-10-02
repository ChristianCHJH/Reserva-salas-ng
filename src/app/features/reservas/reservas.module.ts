import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ReservasComponent } from './components/reservas.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
    declarations: [
        ReservasComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        TableModule,
        ButtonModule,
        CalendarModule,
        FullCalendarModule,
        SelectButtonModule
    ],
    exports: [
        ReservasComponent
    ]
})
export class ReservasModule { }
