/**
 * 🔧 FUNCIONES AUXILIARES GLOBALES
 * Utilidades y helpers que se usan en toda la aplicación
 */

import { COLOR_NAMES, COLOR_MAP } from '../config/color.js';
import { CATALOG_PRODUCTS } from '../config/storeData.js';

/**
 * 📝 Obtener nombre de color en español
 */
export const getColorName = (colorCode) => {
    return COLOR_NAMES[colorCode] || colorCode;
};

/**
 * 🎨 Obtener código de color
 */
export const getColorCode = (colorName) => {
    return COLOR_MAP[colorName] || '#000000';
};

/**
 * 📊 Obtener colores de un producto
 */
export const getColorsFromProduct = (product) => {
    if (!product.variants || product.variants.length === 0) return [];
    return [...new Set(product.variants.map(v => v.color))];
};

/**
 * 📏 Obtener tallas de un producto
 */
export const getSizesFromProduct = (product) => {
    if (!product.variants || product.variants.length === 0) return [];
    return [...new Set(product.variants.map(v => v.size))];
};

/**
 * 🏷️ Obtener nombres de colores de un producto
 */
export const getColorNamesFromProduct = (product) => {
    const colors = getColorsFromProduct(product);
    return colors.map(c => getColorName(c)).join(', ');
};

/**
 * 📐 Obtener nombres de tallas de un producto
 */
export const getSizeNamesFromProduct = (product) => {
    const sizes = getSizesFromProduct(product);
    return sizes.join(', ');
};

/**
 * 💰 Obtener precio mínimo de un producto
 */
export const getMinPriceFromProduct = (product) => {
    if (!product.variants || product.variants.length === 0) return 0;
    return Math.min(...product.variants.map(v => v.price));
};

/**
 * 💰 Obtener precio máximo de un producto
 */
export const getMaxPriceFromProduct = (product) => {
    if (!product.variants || product.variants.length === 0) return 0;
    return Math.max(...product.variants.map(v => v.price));
};

/**
 * 📦 Obtener stock total de un producto
 */
export const getTotalStockFromProduct = (product) => {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce((sum, v) => sum + v.stock, 0);
};

/**
 * 📝 Obtener nombre de diseño desde ruta
 */
export const getDesignNameFromPath = (designPath) => {
    if (!designPath) return 'N/A';
    const fileName = designPath.split('/').pop();
    return fileName.replace(/\.[^/.]+$/, '');
};

/**
 * 💵 Formatear precio
 */
export const formatPrice = (price, currency = 'S/.') => {
    return `${currency} ${price.toFixed(2)}`;
};

/**
 * 📅 Formatear fecha
 */
export const formatDate = (date, locale = 'es-ES') => {
    return new Date(date).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * ⏰ Formatear hora
 */
export const formatTime = (date, locale = 'es-ES') => {
    return new Date(date).toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * 📅⏰ Formatear fecha y hora
 */
export const formatDateTime = (date, locale = 'es-ES') => {
    return new Date(date).toLocaleString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * ✅ Validar email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * ✅ Validar teléfono
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
};

/**
 * 🔤 Capitalizar primera letra
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * 🔤 Convertir a mayúsculas
 */
export const toUpperCase = (str) => {
    return str ? str.toUpperCase() : '';
};

/**
 * 🔤 Convertir a minúsculas
 */
export const toLowerCase = (str) => {
    return str ? str.toLowerCase() : '';
};

/**
 * 🔤 Convertir a título
 */
export const toTitleCase = (str) => {
    if (!str) return '';
    return str.split(' ').map(word => capitalize(word)).join(' ');
};

/**
 * 🔢 Generar número aleatorio
 */
export const generateRandomNumber = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 🆔 Generar ID único
 */
export const generateUniqueId = (prefix = '') => {
    return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 📋 Copiar al portapapeles
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return { success: true, message: 'Copiado al portapapeles' };
    } catch (err) {
        console.error('Error al copiar:', err);
        return { success: false, error: err.message };
    }
};

/**
 * 💾 Descargar archivo
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * 📊 Calcular porcentaje
 */
export const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
};

/**
 * 📊 Calcular descuento
 */
export const calculateDiscount = (originalPrice, discountPercentage) => {
    return originalPrice * (discountPercentage / 100);
};

/**
 * 📊 Calcular precio con descuento
 */
export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    return originalPrice - calculateDiscount(originalPrice, discountPercentage);
};

/**
 * 📊 Calcular impuesto
 */
export const calculateTax = (price, taxRate = 0.18) => {
    return price * taxRate;
};

/**
 * 📊 Calcular precio con impuesto
 */
export const calculatePriceWithTax = (price, taxRate = 0.18) => {
    return price + calculateTax(price, taxRate);
};

/**
 * 🔍 Buscar en array
 */
export const searchInArray = (array, query, fields = []) => {
    if (!query) return array;
    
    const lowerQuery = query.toLowerCase();
    return array.filter(item => {
        if (fields.length === 0) {
            return JSON.stringify(item).toLowerCase().includes(lowerQuery);
        }
        return fields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(lowerQuery);
        });
    });
};

/**
 * 🔄 Ordenar array
 */
export const sortArray = (array, field, order = 'asc') => {
    const sorted = [...array];
    sorted.sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];
        
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });
    
    return sorted;
};

/**
 * 🔀 Agrupar array
 */
export const groupArray = (array, field) => {
    return array.reduce((acc, item) => {
        const key = item[field];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});
};

/**
 * 📊 Obtener estadísticas de array
 */
export const getArrayStats = (array, field) => {
    const values = array.map(item => item[field]).filter(v => typeof v === 'number');
    
    if (values.length === 0) {
        return { count: 0, sum: 0, average: 0, min: 0, max: 0 };
    }
    
    return {
        count: values.length,
        sum: values.reduce((a, b) => a + b, 0),
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
    };
};

/**
 * ⏱️ Esperar (delay)
 */
export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 🔄 Reintentar función
 */
export const retry = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            await delay(delay);
        }
    }
};

/**
 * 💾 Guardar en localStorage
 */
export const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return { success: true };
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
        return { success: false, error: error.message };
    }
};

/**
 * 📖 Obtener de localStorage
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error obteniendo de localStorage:', error);
        return defaultValue;
    }
};

/**
 * 🗑️ Eliminar de localStorage
 */
export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return { success: true };
    } catch (error) {
        console.error('Error eliminando de localStorage:', error);
        return { success: false, error: error.message };
    }
};

/**
 * 🧹 Limpiar localStorage
 */
export const clearLocalStorage = () => {
    try {
        localStorage.clear();
        return { success: true };
    } catch (error) {
        console.error('Error limpiando localStorage:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getColorName,
    getColorCode,
    getColorsFromProduct,
    getSizesFromProduct,
    getColorNamesFromProduct,
    getSizeNamesFromProduct,
    getMinPriceFromProduct,
    getMaxPriceFromProduct,
    getTotalStockFromProduct,
    getDesignNameFromPath,
    formatPrice,
    formatDate,
    formatTime,
    formatDateTime,
    isValidEmail,
    isValidPhone,
    capitalize,
    toUpperCase,
    toLowerCase,
    toTitleCase,
    generateRandomNumber,
    generateUniqueId,
    copyToClipboard,
    downloadFile,
    calculatePercentage,
    calculateDiscount,
    calculateDiscountedPrice,
    calculateTax,
    calculatePriceWithTax,
    searchInArray,
    sortArray,
    groupArray,
    getArrayStats,
    delay,
    retry,
    saveToLocalStorage,
    getFromLocalStorage,
    removeFromLocalStorage,
    clearLocalStorage
};
