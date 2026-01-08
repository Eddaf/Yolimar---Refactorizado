/**
 * 🛒 MÓDULO DE CARRITO DE COMPRA
 * Gestiona toda la lógica del carrito
 * Se integra con el contexto de React
 */

import { getPriceWithDiscount } from '../config/constants.js';

/**
 * Clase para gestionar el carrito
 */
export class CartManager {
    constructor() {
        this.customItems = this.loadCustomCart();
        this.catalogItems = this.loadCatalogCart();
    }

    // ============================================
    // 💾 PERSISTENCIA
    // ============================================

    loadCustomCart() {
        try {
            const saved = localStorage.getItem('modadtf_cart_custom');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error cargando carrito personalizado:', e);
            return [];
        }
    }

    loadCatalogCart() {
        try {
            const saved = localStorage.getItem('modadtf_cart_catalog');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error cargando carrito de catálogo:', e);
            return [];
        }
    }

    saveCustomCart() {
        localStorage.setItem('modadtf_cart_custom', JSON.stringify(this.customItems));
    }

    saveCatalogCart() {
        localStorage.setItem('modadtf_cart_catalog', JSON.stringify(this.catalogItems));
    }

    // ============================================
    // ➕ AGREGAR ITEMS
    // ============================================

    addCustomItem(product) {
        const item = {
            ...product,
            cartItemId: Date.now(),
            addedAt: new Date().toISOString()
        };
        this.customItems.push(item);
        this.saveCustomCart();
        return item;
    }

    addCatalogItem(product, color, size, quantity) {
        const existing = this.catalogItems.find(
            i => i.id === product.id && i.selectedColor === color && i.selectedSize === size
        );

        if (existing) {
            existing.quantity += quantity;
        } else {
            this.catalogItems.push({
                ...product,
                selectedColor: color,
                selectedSize: size,
                quantity: quantity,
                cartItemId: Date.now(),
                addedAt: new Date().toISOString()
            });
        }
        this.saveCatalogCart();
    }

    // ============================================
    // ❌ ELIMINAR ITEMS
    // ============================================

    removeCustomItem(cartItemId) {
        this.customItems = this.customItems.filter(i => i.cartItemId !== cartItemId);
        this.saveCustomCart();
    }

    removeCatalogItem(cartItemId) {
        this.catalogItems = this.catalogItems.filter(i => i.cartItemId !== cartItemId);
        this.saveCatalogCart();
    }

    // ============================================
    // 📝 ACTUALIZAR ITEMS
    // ============================================

    updateCustomQuantity(cartItemId, quantity) {
        const item = this.customItems.find(i => i.cartItemId === cartItemId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCustomCart();
        }
    }

    updateCatalogQuantity(cartItemId, delta) {
        const item = this.catalogItems.find(i => i.cartItemId === cartItemId);
        if (item) {
            item.quantity = Math.max(1, item.quantity + delta);
            if (item.quantity <= 0) {
                this.removeCatalogItem(cartItemId);
            } else {
                this.saveCatalogCart();
            }
        }
    }

    // ============================================
    // 💰 CÁLCULOS
    // ============================================

    getCustomTotal() {
        return this.customItems.reduce((acc, item) => {
            const type = item.type || 'polera';
            const discountInfo = getPriceWithDiscount(type, item.details.size, item.quantity || 1, true);
            return acc + (discountInfo.discountedPrice * (item.quantity || 1));
        }, 0);
    }

    getCatalogTotal() {
        return this.catalogItems.reduce((acc, item) => {
            const type = item.type || 'polera';
            const discountInfo = getPriceWithDiscount(type, item.selectedSize, item.quantity, false);
            return acc + (discountInfo.discountedPrice * item.quantity);
        }, 0);
    }

    getTotal() {
        return this.getCustomTotal() + this.getCatalogTotal();
    }

    getTotalItems() {
        const customCount = this.customItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const catalogCount = this.catalogItems.reduce((sum, item) => sum + item.quantity, 0);
        return customCount + catalogCount;
    }

    // ============================================
    // 📊 INFORMACIÓN
    // ============================================

    getAllItems() {
        return [...this.customItems, ...this.catalogItems];
    }

    getCustomItems() {
        return this.customItems;
    }

    getCatalogItems() {
        return this.catalogItems;
    }

    isEmpty() {
        return this.customItems.length === 0 && this.catalogItems.length === 0;
    }

    // ============================================
    // 🗑️ LIMPIAR
    // ============================================

    clearCustomCart() {
        this.customItems = [];
        this.saveCustomCart();
    }

    clearCatalogCart() {
        this.catalogItems = [];
        this.saveCatalogCart();
    }

    clearAll() {
        this.clearCustomCart();
        this.clearCatalogCart();
    }

    // ============================================
    // 📦 EXPORTAR DATOS
    // ============================================

    exportAsJSON() {
        return {
            custom: this.customItems,
            catalog: this.catalogItems,
            totals: {
                customTotal: this.getCustomTotal(),
                catalogTotal: this.getCatalogTotal(),
                total: this.getTotal(),
                items: this.getTotalItems()
            },
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Generar resumen del carrito para PDF/Reporte
     */
    generateSummary() {
        const summary = {
            items: this.getAllItems().map(item => ({
                name: item.name || item.type,
                quantity: item.quantity || 1,
                price: item.price || 0,
                subtotal: (item.price || 0) * (item.quantity || 1)
            })),
            subtotal: this.getTotal(),
            tax: this.getTotal() * 0.18,
            total: this.getTotal() * 1.18
        };
        return summary;
    }
}

// Crear instancia global
export const cartManager = new CartManager();
