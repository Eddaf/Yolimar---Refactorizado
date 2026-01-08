/**
 * 📝 TIPOGRAFÍA CENTRALIZADA
 * Define todas las fuentes y estilos de texto
 * Cambios aquí se replican en toda la aplicación
 */

// Importar fuentes de Google Fonts (agregar en HTML)
export const TYPOGRAPHY = {
    // Fuentes principales
    fontFamily: {
        primary: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        secondary: "'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        mono: "'Courier New', monospace"
    },

    // Tamaños de fuente
    fontSize: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        lg: '1.125rem',     // 18px
        xl: '1.25rem',      // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
        '5xl': '3rem',      // 48px
    },

    // Pesos de fuente
    fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900
    },

    // Alturas de línea
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2
    },

    // Espaciado de letras
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
    },

    // Estilos predefinidos
    styles: {
        h1: {
            fontSize: '2.25rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.05em'
        },
        h2: {
            fontSize: '1.875rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.025em'
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '0em'
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
            letterSpacing: '0em'
        },
        h5: {
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.4,
            letterSpacing: '0em'
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: '0em'
        },
        body: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: '0em'
        },
        bodySmall: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: '0em'
        },
        caption: {
            fontSize: '0.75rem',
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: '0.05em'
        },
        button: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: '0em'
        }
    }
};

// Función para aplicar estilos de tipografía
export const applyTypography = (element, styleKey) => {
    const style = TYPOGRAPHY.styles[styleKey];
    if (style) {
        Object.assign(element.style, {
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing
        });
    }
};

// Función para obtener CSS de tipografía
export const getTypographyCSS = (styleKey) => {
    const style = TYPOGRAPHY.styles[styleKey];
    if (!style) return '';
    
    return `
        font-size: ${style.fontSize};
        font-weight: ${style.fontWeight};
        line-height: ${style.lineHeight};
        letter-spacing: ${style.letterSpacing};
    `;
};
