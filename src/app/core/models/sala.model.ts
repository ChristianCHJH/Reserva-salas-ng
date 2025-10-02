export interface Sala {
    salaId: string;
    nombre: string;
    color?: string;
    activa: boolean;
    fechaCreacion: string;
    fechaActualizacion: string | null;
}

