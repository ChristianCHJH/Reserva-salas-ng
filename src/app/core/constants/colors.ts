export type ColorToken =
    | 'blue'
    | 'green'
    | 'yellow'
    | 'red'
    | 'purple'
    | 'teal'
    | 'indigo'
    | 'gray';

export interface ColorStyle {
    bg: string;
    text: string;
    border: string;
}

export const MAPA_COLORES: Record<ColorToken, ColorStyle> = {
    blue:   { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
    green:  { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' },
    yellow: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    red:    { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
    purple: { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
    teal:   { bg: '#CCFBF1', text: '#115E59', border: '#99F6E4' },
    indigo: { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },
    gray:   { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' }
};

export function getColorStyles(color?: string): ColorStyle {
    if (!color) return MAPA_COLORES.gray;
    const key = color.toLowerCase() as ColorToken;
    return (MAPA_COLORES[key] as ColorStyle) ?? { bg: color, text: '#1F2937', border: color };
}

