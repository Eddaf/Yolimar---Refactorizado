/**
 * 🎨 SISTEMA DE COLORES CENTRALIZADO
 * Todos los colores de la aplicación en un solo lugar
 * Cambios aquí se replican automáticamente en toda la app
 */

export const PRIMARY_COLOR_HEX = '#0d9488';

// Función para convertir HEX a RGBA
export const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Función para ajustar colores HEX
export const adjustHexColor = (hex, percent) => {
    const num = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

// Sistema de colores principal
export const COLOR_SYSTEM = {
    // Colores primarios
    primary: PRIMARY_COLOR_HEX,
    primaryDark: adjustHexColor(PRIMARY_COLOR_HEX, -20),
    primaryLight: adjustHexColor(PRIMARY_COLOR_HEX, 20),
    primaryVeryLight: hexToRgba(PRIMARY_COLOR_HEX, 0.1),
    primaryHover: adjustHexColor(PRIMARY_COLOR_HEX, -10),
    
    // Colores secundarios
    secondary: '#ffffff',
    secondaryDark: '#f8fafc',
    
    // Estados
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Texto
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textOnPrimary: '#ffffff',
    
    // Bordes
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
};

// Mapa de colores de productos
export const COLOR_MAP = {
    'negro': '#000000',
    'blanco': '#FFFFFF',
    'rosa': '#E91E63',
    'rojo': '#F44336',
    'azul': '#2196F3',
    'verde': '#4CAF50',
    'amarillo': '#FFEB3B',
    'naranja': '#FF9800',
    'morado': '#9C27B0',
    'gris': '#9E9E9E',
    'beige': '#D7CCC8',
    'marron': '#795548',
    'bordo': '#880E4F',
    'dorado': '#FFD700',
    'plata': '#C0C0C0',
    'multicolor': 'linear-gradient(45deg, #F44336, #FFEB3B, #4CAF50, #2196F3)'
};

// Nombres de colores en español
export const COLOR_NAMES = {
    'negro': 'Negro',
    'blanco': 'Blanco',
    'rosa': 'Rosa',
    'rojo': 'Rojo',
    'azul': 'Azul',
    'verde': 'Verde',
    'amarillo': 'Amarillo',
    'naranja': 'Naranja',
    'morado': 'Morado',
    'gris': 'Gris',
    'beige': 'Beige',
    'marron': 'Marrón',
    'bordo': 'Bordó',
    'dorado': 'Dorado',
    'plata': 'Plata',
    'multicolor': 'Multicolor'
};
