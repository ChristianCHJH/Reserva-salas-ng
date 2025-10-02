import type { Sala } from './sala.model';
import type { Usuario } from './usuario.model';

export interface Reserva {
    id: string;
    inicio: string;
    fin: string;
    titulo: string;
    descripcion: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    sala: Sala;
    usuario: Usuario;
}

