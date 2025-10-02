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
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
    declarations: [
        ReservasComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        TableModule,
        ButtonModule,
        CalendarModule,
        FullCalendarModule,
        SelectButtonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        DialogModule,
        ToastModule
    ],
    exports: [
        ReservasComponent
    ],
    providers: [MessageService]
})
export class ReservasModule { }
