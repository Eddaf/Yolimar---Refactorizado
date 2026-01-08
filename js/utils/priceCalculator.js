/**
 * 💰 CALCULADOR DE PRECIOS
 * Gestiona toda la lógica de cálculo de precios, descuentos e impuestos
 */

import { CONFIG_DATA, SIZE_GROUPS } from '../../config/constants.js';

/**
 * Obtener precio base por tipo y talla
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
 * Obtener precio con descuento aplicado
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

/**
 * Calcular precio total con cantidad
 */
export const calculateTotalPrice = (type, size, quantity, isCustom = false) => {
    const priceInfo = getPriceWithDiscount(type, size, quantity, isCustom);
    return priceInfo.discountedPrice * quantity;
};

/**
 * Calcular desglose de precio completo
 */
export const calculatePriceBreakdown = (type, size, quantity, isCustom = false, taxRate = 0.18) => {
    const priceInfo = getPriceWithDiscount(type, size, quantity, isCustom);
    const unitPrice = priceInfo.discountedPrice;
    const subtotal = unitPrice * quantity;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    return {
        unitPrice,
        quantity,
        subtotal,
        discount: priceInfo.hasDiscount ? priceInfo.savings : 0,
        discountPercentage: priceInfo.discountPercentage,
        tax,
        total,
        hasDiscount: priceInfo.hasDiscount,
        minQuantityForDiscount: priceInfo.minQuantity || 0
    };
};

/**
 * Calcular precio para múltiples items
 */
export const calculateCartTotal = (items, taxRate = 0.18) => {
    let subtotal = 0;
    let totalDiscount = 0;
    
    items.forEach(item => {
        const type = item.type || 'polera';
        const size = item.selectedSize || item.details?.size || 'M';
        const quantity = item.quantity || 1;
        const isCustom = item.isCustom || false;
        
        const priceInfo = getPriceWithDiscount(type, size, quantity, isCustom);
        const itemTotal = priceInfo.discountedPrice * quantity;
        
        subtotal += itemTotal;
        if (priceInfo.hasDiscount) {
            totalDiscount += priceInfo.savings;
        }
    });
    
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    return {
        subtotal,
        discount: totalDiscount,
        tax,
        total,
        taxRate
    };
};

/**
 * Obtener información de descuento disponible
 */
export const getDiscountInfo = (type, isCustom = false) => {
    const config = isCustom ? CONFIG_DATA.customConfig : CONFIG_DATA.types[type];
    
    if (!config || !config.discount.enabled) {
        return null;
    }
    
    return {
        percentage: config.discount.percentage,
        minQuantity: config.discount.minQuantity,
        description: config.discount.description
    };
};

/**
 * Verificar si aplica descuento
 */
export const hasDiscount = (type, quantity, isCustom = false) => {
    const config = isCustom ? CONFIG_DATA.customConfig : CONFIG_DATA.types[type];
    
    if (!config || !config.discount.enabled) {
        return false;
    }
    
    return quantity >= config.discount.minQuantity;
};

/**
 * Calcular cantidad necesaria para descuento
 */
export const getQuantityForDiscount = (type, isCustom = false) => {
    const config = isCustom ? CONFIG_DATA.customConfig : CONFIG_DATA.types[type];
    
    if (!config || !config.discount.enabled) {
        return null;
    }
    
    return config.discount.minQuantity;
};

/**
 * Calcular ahorro total
 */
export const calculateTotalSavings = (type, size, quantity, isCustom = false) => {
    const priceInfo = getPriceWithDiscount(type, size, quantity, isCustom);
    return priceInfo.savings;
};

/**
 * Obtener rango de precios de un tipo
 */
export const getPriceRange = (type, isCustom = false) => {
    const config = isCustom ? CONFIG_DATA.customConfig : CONFIG_DATA.types[type];
    
    if (!config) {
        return { min: 0, max: 0 };
    }
    
    const prices = Object.values(config.pricesBySizeGroup).map(pg => pg.base);
    
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
};

/**
 * Formatear precio
 */
export const formatPrice = (price, currency = 'S/.') => {
    return `${currency} ${price.toFixed(2)}`;
};

/**
 * Comparar precios
 */
export const comparePrices = (type1, type2, size, quantity) => {
    const price1 = calculateTotalPrice(type1, size, quantity, false);
    const price2 = calculateTotalPrice(type2, size, quantity, false);
    
    return {
        type1: { type: type1, price: price1 },
        type2: { type: type2, price: price2 },
        difference: Math.abs(price1 - price2),
        cheaper: price1 < price2 ? type1 : type2
    };
};

export default {
    getPriceByTypeAndSize,
    getPriceWithDiscount,
    calculateTotalPrice,
    calculatePriceBreakdown,
    calculateCartTotal,
    getDiscountInfo,
    hasDiscount,
    getQuantityForDiscount,
    calculateTotalSavings,
    getPriceRange,
    formatPrice,
    comparePrices
};
