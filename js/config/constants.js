/**
 * 🔧 CONSTANTES Y VARIABLES GLOBALES
 * Arreglos, configuraciones y datos que se usan en toda la aplicación
 * Cambios aquí se replican automáticamente
 */

// ============================================
// 📏 TAMAÑOS Y GRUPOS DE TALLAS
// ============================================
export const SIZE_GROUPS = {
    'S': 'S',
    'XS': 'S',
    'M': 'ML',
    'L': 'ML',
    'XL': 'XL',
    'XXL': 'XL'
};

export const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// ============================================
// 🎯 CONFIGURACIÓN DE TIPOS DE PRENDAS
// ============================================
export const TYPE_IMAGES = {
    polera: 'imagenes/PolerasAlgodon/poleraBlancoALG1.png',
    saco: 'imagenes/Sacos/sacoLARG1.png',
    blusa: 'imagenes/Blusas/blusaEST1.png',
    solera: 'imagenes/Solera/solBlanco1.png'
};

export const CONFIG_DATA = {
    types: {
        polera: {
            id: 'polera',
            name: 'Polera',
            image: TYPE_IMAGES.polera,
            hasSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            pricesBySizeGroup: {
                'S': { id: 'pg_polera_s', base: 55, label: 'Talla S' },
                'ML': { id: 'pg_polera_ml', base: 55, label: 'Tallas M, L' },
                'XL': { id: 'pg_polera_xl', base: 60, label: 'Tallas XL, XXL' }
            },
            discount: { enabled: true, percentage: 10, minQuantity: 3, description: '10% OFF desde 3 uni.' },
            description: 'Poleras básicas de algodón'
        },
        saco: {
            id: 'saco',
            name: 'Saco',
            image: TYPE_IMAGES.saco,
            hasSizes: ['S', 'M', 'L', 'XL', 'XXL'],
            pricesBySizeGroup: {
                'S': { id: 'pg_saco_s', base: 189, label: 'Talla S' },
                'ML': { id: 'pg_saco_ml', base: 189, label: 'Tallas M, L' },
                'XL': { id: 'pg_saco_xl', base: 199, label: 'Tallas XL, XXL' }
            },
            discount: { enabled: true, percentage: 10, minQuantity: 3, description: '10% OFF desde 3 uni.' },
            description: 'Abrigos y sakos formales'
        },
        blusa: {
            id: 'blusa',
            name: 'Blusa',
            image: TYPE_IMAGES.blusa,
            hasSizes: ['XS', 'S', 'M', 'L', 'XL'],
            pricesBySizeGroup: {
                'S': { id: 'pg_blusa_s', base: 77, label: 'Talla S' },
                'ML': { id: 'pg_blusa_ml', base: 77, label: 'Tallas M, L' },
                'XL': { id: 'pg_blusa_xl', base: 82, label: 'Talla XL' }
            },
            discount: { enabled: true, percentage: 10, minQuantity: 3, description: '10% OFF desde 3 uni.' },
            description: 'Blusas y tops elegantes'
        },
        solera: {
            id: 'solera',
            name: 'Solera',
            image: TYPE_IMAGES.solera,
            hasSizes: ['S', 'M', 'L', 'XL'],
            pricesBySizeGroup: {
                'S': { id: 'pg_solera_s', base: 93, label: 'Talla S' },
                'ML': { id: 'pg_solera_ml', base: 93, label: 'Tallas M, L' },
                'XL': { id: 'pg_solera_xl', base: 98, label: 'Talla XL' }
            },
            discount: { enabled: true, percentage: 10, minQuantity: 3, description: '10% OFF desde 3 uni.' },
            description: 'Prendas tradicionales'
        }
    },
    customConfig: {
        id: 'custom',
        name: 'Polera Personalizada',
        emoji: '🎨',
        basePrice: 60,
        pricesBySizeGroup: {
            'S': { id: 'pg_custom_s', base: 60, label: 'Talla S' },
            'ML': { id: 'pg_custom_ml', base: 60, label: 'Tallas M, L' },
            'XL': { id: 'pg_custom_xl', base: 65, label: 'Tallas XL, XXL' }
        },
        discount: { enabled: true, percentage: 5, minQuantity: 12, description: '5% OFF desde 12 uni.' },
        description: 'Poleras personalizadas del diseñador'
    }
};

// ============================================
// 🖼️ BASE DE DATOS DE IMÁGENES
// ============================================
export const IMAGES_DB = {
    Algodon: {
        blanco: "imagenes/PolerasAlgodon/poleraBlancoALG1.png",
        negro: "imagenes/PolerasAlgodon/poleraNegroALG1.png",
        rojo: "imagenes/PolerasAlgodon/poleraRojoALG1.png",
        azul: "imagenes/PolerasAlgodon/poleraAzulALG1.png",
        verde: "imagenes/PolerasAlgodon/poleraVerdeALG1.png",
        gris: "imagenes/PolerasAlgodon/poleraPlomoALG1.png"
    },
    Poliester: {
        blanco: "imagenes/PolerasPoliester/poleraBlancoPOL1.png",
        negro: "imagenes/PolerasPoliester/poleraNegroPOL1.png",
        rojo: "imagenes/PolerasPoliester/poleraRojoPOL1.png",
        azul: "imagenes/PolerasPoliester/poleraAzulPOL1.png",
        verde: "imagenes/PolerasPoliester/poleraVerdePOL1.png",
        gris: "imagenes/PolerasPoliester/poleraPlomoPOL1.png"
    },
    V: {
        blanco: "imagenes/PolerasCuelloV/poleraBlancoCV1.png",
        negro: "imagenes/PolerasCuelloV/poleraNegroCV1.png",
        rojo: "imagenes/PolerasCuelloV/poleraRojoCV1.png",
        azul: "imagenes/PolerasCuelloV/poleraAzulCV1.png",
        verde: "imagenes/PolerasCuelloV/poleraVerdeCV1.png",
        gris: "imagenes/PolerasCuelloV/poleraPlomoCV1.png"
    }
};

// ============================================
// 🎨 BASE DE DATOS DE DISEÑOS
// ============================================
export const DESIGNS_DB = [
    { id: 1, name: 'EST_IMG1', img: "imagenes/Estampado/EST_IMG1.png" },
    { id: 2, name: 'EST_IMG2', img: "imagenes/Estampado/EST_IMG2.png" },
    { id: 3, name: 'EST_IMG3', img: "imagenes/Estampado/EST_IMG3.png" },
    { id: 4, name: 'EST_IMG4', img: "imagenes/Estampado/EST_IMG4.png" },
    { id: 5, name: 'EST_IMG5', img: "imagenes/Estampado/EST_IMG5.png" },
    { id: 6, name: 'EST_IMG6', img: "imagenes/Estampado/EST_IMG6.png" },
    { id: 7, name: 'EST_IMG7', img: "imagenes/Estampado/EST_IMG7.png" },
    { id: 8, name: 'EST_IMG8', img: "imagenes/Estampado/EST_IMG8.png" },
    { id: 9, name: 'EST_IMG9', img: "imagenes/Estampado/EST_IMG9.png" },
    { id: 10, name: 'EST_IMG10', img: "imagenes/Estampado/EST_IMG10.png" },
    { id: 11, name: 'EST_IMG11', img: "imagenes/Estampado/EST_IMG11.png" },
    { id: 12, name: 'EST_IMG12', img: "imagenes/Estampado/EST_IMG12.png" },
    { id: 13, name: 'EST_IMG13', img: "imagenes/Estampado/EST_IMG13.png" }
];

// ============================================
// 👥 USUARIOS ADMINISTRADORES
// ============================================
export const ADMIN_USERS = [
    { email: 'eddar@gmail.com', password: '1234', name: 'Eduardo', role: 'admin' },
    { email: 'admin@modadtf.pe', password: 'admin2024', name: 'Administrador', role: 'admin' },
    { email: 'ventas@modadtf.pe', password: 'ventas2024', name: 'Ventas', role: 'editor' }
];

// ============================================
// 🔧 FUNCIONES AUXILIARES
// ============================================

/**
 * Obtener precio por tipo y talla
 */
export const getPriceByTypeAndSize = (type, size, isCustom = false) => {
    if (isCustom) {
        const config = CONFIG_DATA.customConfig;
        const group = SIZE_GROUPS[size] || 'ML';
        return config.pricesBySizeGroup[group]?.base || 60;
    }
    const config = CONFIG_DATA.types[type];
    if (!config) return 55;
    const group = SIZE_GROUPS[size] || 'ML';
    return config.pricesBySizeGroup[group]?.base || 55;
};

/**
 * Obtener precio con descuento
 */
export const getPriceWithDiscount = (type, size, quantity, isCustom = false) => {
    const basePrice = getPriceByTypeAndSize(type, size, isCustom);
    const config = isCustom ? CONFIG_DATA.customConfig : CONFIG_DATA.types[type];

    if (!config || !config.discount.enabled) {
        return {
            basePrice,
            discountedPrice: basePrice,
            discountPercentage: 0,
            hasDiscount: false,
            savings: 0
        };
    }

    if (quantity >= config.discount.minQuantity) {
        const discountAmount = basePrice * (config.discount.percentage / 100);
        return {
            basePrice,
            discountedPrice: basePrice - discountAmount,
            discountPercentage: config.discount.percentage,
            hasDiscount: true,
            savings: discountAmount * quantity,
            minQuantity: config.discount.minQuantity
        };
    }

    return {
        basePrice,
        discountedPrice: basePrice,
        discountPercentage: 0,
        hasDiscount: false,
        savings: 0,
        minQuantity: config.discount.minQuantity
    };
};
