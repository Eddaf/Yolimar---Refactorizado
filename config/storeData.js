/**
 * 🏪 INFORMACIÓN DE LA TIENDA
 * Datos centralizados de la tienda que se muestran en toda la aplicación
 * Cambios aquí se replican automáticamente en toda la app
 */

export const STORE_INFO = {
    // Información básica
    name: 'YOLIMAR',
    tagline: 'Ropa & Diseños Personalizados',
    description: 'Tienda de ropa personalizada con diseños únicos y de calidad',

    // Contacto
    contact: {
        phone: '+51 999 999 999',
        email: 'info@yolimar.pe',
        whatsapp: '+51 999 999 999',
        address: 'Lima, Perú'
    },

    // Redes sociales
    social: {
        facebook: 'https://facebook.com/yolimar',
        instagram: 'https://instagram.com/yolimar',
        tiktok: 'https://tiktok.com/@yolimar',
        twitter: 'https://twitter.com/yolimar'
    },

    // Horarios
    hours: {
        monday: '09:00 - 18:00',
        tuesday: '09:00 - 18:00',
        wednesday: '09:00 - 18:00',
        thursday: '09:00 - 18:00',
        friday: '09:00 - 18:00',
        saturday: '10:00 - 16:00',
        sunday: 'Cerrado'
    },

    // Políticas
    policies: {
        shipping: 'Envío a todo el país',
        returns: '30 días para devoluciones',
        warranty: 'Garantía de calidad',
        payment: 'Múltiples formas de pago'
    },

    // Configuración de navbar
    navbar: {
        logoUrl: 'imagenes/Logos/Yolimar_LB.png',
        showText: false,
        maxWidth: 120,
        maxHeight: 500
    },

    // Configuración de tienda
    store: {
        currency: 'S/.',
        currencyCode: 'PEN',
        taxRate: 0.18, // 18% IGV
        shippingCost: 15,
        freeShippingThreshold: 200
    },

    // Mensajes personalizados
    messages: {
        welcome: '¡Bienvenido a YOLIMAR!',
        emptyCart: 'Tu carrito está vacío',
        addToCart: 'Agregar al carrito',
        checkout: 'Proceder al pago',
        orderConfirmed: 'Pedido confirmado',
        thankYou: '¡Gracias por tu compra!'
    }
};

/**
 * Obtener información de contacto formateada
 */
export const getContactInfo = () => {
    return {
        phone: STORE_INFO.contact.phone,
        email: STORE_INFO.contact.email,
        whatsapp: STORE_INFO.contact.whatsapp,
        address: STORE_INFO.contact.address
    };
};

/**
 * Obtener horarios de atención
 */
export const getBusinessHours = () => {
    return STORE_INFO.hours;
};

/**
 * Obtener información de políticas
 */
export const getPolicies = () => {
    return STORE_INFO.policies;
};

/**
 * Obtener configuración de tienda
 */
export const getStoreConfig = () => {
    return STORE_INFO.store;
};

/**
 * Calcular precio con impuestos
 */
export const calculateWithTax = (price) => {
    const tax = price * STORE_INFO.store.taxRate;
    return {
        subtotal: price,
        tax: tax,
        total: price + tax
    };
};

/**
 * Calcular envío
 */
export const calculateShipping = (subtotal) => {
    if (subtotal >= STORE_INFO.store.freeShippingThreshold) {
        return 0;
    }
    return STORE_INFO.store.shippingCost;
};
