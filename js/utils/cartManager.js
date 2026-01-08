/**
 * 🛒 GESTOR DE CARRITO AVANZADO
 * Maneja la lógica completa del carrito de compra
 * Integra items personalizados y del catálogo
 */

import { getPriceWithDiscount } from './priceCalculator.js';

/**
 * Clase para gestionar el carrito completo
 */
export class CartManager {
    constructor() {
        this.customItems = this.loadCustomCart();
        this.catalogItems = this.loadCatalogCart();
        this.observers = [];
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
        this.notifyObservers();
    }

    saveCatalogCart() {
        localStorage.setItem('modadtf_cart_catalog', JSON.stringify(this.catalogItems));
        this.notifyObservers();
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
        return existing || this.catalogItems[this.catalogItems.length - 1];
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

    removeByIndex(index, isCustom = true) {
        if (isCustom) {
            this.customItems.splice(index, 1);
            this.saveCustomCart();
        } else {
            this.catalogItems.splice(index, 1);
            this.saveCatalogCart();
        }
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

    updateCatalogItem(cartItemId, updates) {
        const item = this.catalogItems.find(i => i.cartItemId === cartItemId);
        if (item) {
            Object.assign(item, updates);
            this.saveCatalogCart();
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

    getTotalWithTax(taxRate = 0.18) {
        return this.getTotal() * (1 + taxRate);
    }

    getTotalItems() {
        const customCount = this.customItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const catalogCount = this.catalogItems.reduce((sum, item) => sum + item.quantity, 0);
        return customCount + catalogCount;
    }

    getTotalTax(taxRate = 0.18) {
        return this.getTotal() * taxRate;
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

    getItemById(cartItemId) {
        return this.getAllItems().find(i => i.cartItemId === cartItemId);
    }

    isEmpty() {
        return this.customItems.length === 0 && this.catalogItems.length === 0;
    }

    getItemCount() {
        return this.customItems.length + this.catalogItems.length;
    }

    // ============================================
    // 🔍 BÚSQUEDA Y FILTRADO
    // ============================================

    findCustomItem(predicate) {
        return this.customItems.find(predicate);
    }

    findCatalogItem(predicate) {
        return this.catalogItems.find(predicate);
    }

    filterCustomItems(predicate) {
        return this.customItems.filter(predicate);
    }

    filterCatalogItems(predicate) {
        return this.catalogItems.filter(predicate);
    }

    // ============================================
    // 🧹 LIMPIAR
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
            tax: this.getTotalTax(),
            total: this.getTotalWithTax()
        };
        return summary;
    }

    /**
     * Generar detalles completos del carrito
     */
    generateDetailedSummary() {
        return {
            customItems: this.customItems.map(item => ({
                ...item,
                subtotal: (item.price || 0) * (item.quantity || 1)
            })),
            catalogItems: this.catalogItems.map(item => ({
                ...item,
                subtotal: (item.price || 0) * item.quantity
            })),
            totals: {
                customTotal: this.getCustomTotal(),
                catalogTotal: this.getCatalogTotal(),
                subtotal: this.getTotal(),
                tax: this.getTotalTax(),
                total: this.getTotalWithTax()
            },
            itemCount: this.getTotalItems(),
            generatedAt: new Date().toISOString()
        };
    }

    // ============================================
    // 👁️ OBSERVADORES (para React Context)
    // ============================================

    subscribe(observer) {
        this.observers.push(observer);
        return () => {
            this.observers = this.observers.filter(o => o !== observer);
        };
    }

    notifyObservers() {
        this.observers.forEach(observer => observer(this));
    }

    // ============================================
    // 🔄 VALIDACIÓN
    // ============================================

    isValid() {
        return !this.isEmpty();
    }

    getValidationErrors() {
        const errors = [];
        
        if (this.isEmpty()) {
            errors.push('El carrito está vacío');
        }
        
        return errors;
    }
}

// Crear instancia global
export const cartManager = new CartManager();

export default cartManager;
