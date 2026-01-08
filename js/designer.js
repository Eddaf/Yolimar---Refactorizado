/**
 * 🎨 MÓDULO DE DISEÑADOR
 * Gestiona la lógica del diseñador personalizado
 */

import { IMAGES_DB, DESIGNS_DB, CONFIG_DATA, SIZE_GROUPS } from '../config/constants.js';
import { getPriceWithDiscount } from '../config/constants.js';

/**
 * Clase para gestionar el diseñador
 */
export class DesignerManager {
    constructor() {
        this.currentDesign = {
            type: 'polera',
            material: 'Algodon',
            color: 'blanco',
            design: null,
            size: 'M',
            quantity: 1,
            customText: '',
            notes: ''
        };
        this.designHistory = [];
    }

    // ============================================
    // 🎨 CONFIGURAR DISEÑO
    // ============================================

    setType(type) {
        this.currentDesign.type = type;
        return this;
    }

    setMaterial(material) {
        this.currentDesign.material = material;
        return this;
    }

    setColor(color) {
        this.currentDesign.color = color;
        return this;
    }

    setDesign(designId) {
        const design = DESIGNS_DB.find(d => d.id === designId);
        this.currentDesign.design = design || null;
        return this;
    }

    setSize(size) {
        this.currentDesign.size = size;
        return this;
    }

    setQuantity(quantity) {
        this.currentDesign.quantity = Math.max(1, quantity);
        return this;
    }

    setCustomText(text) {
        this.currentDesign.customText = text;
        return this;
    }

    setNotes(notes) {
        this.currentDesign.notes = notes;
        return this;
    }

    // ============================================
    // 🖼️ OBTENER IMÁGENES
    // ============================================

    getProductImage() {
        const material = this.currentDesign.material;
        const color = this.currentDesign.color;
        
        if (IMAGES_DB[material] && IMAGES_DB[material][color]) {
            return IMAGES_DB[material][color];
        }
        
        // Fallback a blanco
        if (IMAGES_DB[material]) {
            return IMAGES_DB[material]['blanco'];
        }
        
        return null;
    }

    getDesignImage() {
        return this.currentDesign.design?.img || null;
    }

    // ============================================
    // 💰 CÁLCULOS DE PRECIO
    // ============================================

    getBasePrice() {
        const type = this.currentDesign.type;
        const size = this.currentDesign.size;
        return getPriceWithDiscount(type, size, this.currentDesign.quantity, true);
    }

    getTotalPrice() {
        const priceInfo = this.getBasePrice();
        return priceInfo.discountedPrice * this.currentDesign.quantity;
    }

    getPriceBreakdown() {
        const priceInfo = this.getBasePrice();
        const unitPrice = priceInfo.discountedPrice;
        const totalPrice = unitPrice * this.currentDesign.quantity;
        
        return {
            unitPrice: unitPrice,
            quantity: this.currentDesign.quantity,
            subtotal: totalPrice,
            discount: priceInfo.hasDiscount ? priceInfo.savings : 0,
            tax: totalPrice * 0.18,
            total: totalPrice * 1.18,
            discountPercentage: priceInfo.discountPercentage,
            hasDiscount: priceInfo.hasDiscount
        };
    }

    // ============================================
    // 📋 INFORMACIÓN DEL DISEÑO
    // ============================================

    getDesignSummary() {
        return {
            type: this.currentDesign.type,
            material: this.currentDesign.material,
            color: this.currentDesign.color,
            design: this.currentDesign.design?.name || 'Sin diseño',
            size: this.currentDesign.size,
            quantity: this.currentDesign.quantity,
            customText: this.currentDesign.customText,
            notes: this.currentDesign.notes,
            price: this.getTotalPrice(),
            priceBreakdown: this.getPriceBreakdown()
        };
    }

    // ============================================
    // 💾 HISTORIAL
    // ============================================

    saveToHistory() {
        const design = {
            ...this.currentDesign,
            savedAt: new Date().toISOString(),
            id: Date.now()
        };
        this.designHistory.push(design);
        return design;
    }

    getHistory() {
        return this.designHistory;
    }

    loadFromHistory(id) {
        const design = this.designHistory.find(d => d.id === id);
        if (design) {
            const { savedAt, id: designId, ...designData } = design;
            this.currentDesign = designData;
            return true;
        }
        return false;
    }

    deleteFromHistory(id) {
        this.designHistory = this.designHistory.filter(d => d.id !== id);
    }

    clearHistory() {
        this.designHistory = [];
    }

    // ============================================
    // 🔄 RESET
    // ============================================

    reset() {
        this.currentDesign = {
            type: 'polera',
            material: 'Algodon',
            color: 'blanco',
            design: null,
            size: 'M',
            quantity: 1,
            customText: '',
            notes: ''
        };
        return this;
    }

    // ============================================
    // 📦 EXPORTAR COMO PRODUCTO
    // ============================================

    exportAsProduct() {
        return {
            isCustom: true,
            type: this.currentDesign.type,
            name: `${this.currentDesign.type.charAt(0).toUpperCase() + this.currentDesign.type.slice(1)} Personalizada`,
            details: {
                material: this.currentDesign.material,
                color: this.currentDesign.color,
                design: this.currentDesign.design,
                size: this.currentDesign.size,
                customText: this.currentDesign.customText,
                notes: this.currentDesign.notes
            },
            quantity: this.currentDesign.quantity,
            price: this.getTotalPrice(),
            image: this.getProductImage(),
            designImage: this.getDesignImage(),
            createdAt: new Date().toISOString()
        };
    }

    // ============================================
    // 🎯 VALIDACIÓN
    // ============================================

    isValid() {
        return {
            isValid: this.currentDesign.type && this.currentDesign.size && this.currentDesign.quantity > 0,
            errors: this.getValidationErrors()
        };
    }

    getValidationErrors() {
        const errors = [];
        
        if (!this.currentDesign.type) {
            errors.push('Selecciona un tipo de prenda');
        }
        
        if (!this.currentDesign.size) {
            errors.push('Selecciona una talla');
        }
        
        if (this.currentDesign.quantity <= 0) {
            errors.push('La cantidad debe ser mayor a 0');
        }
        
        return errors;
    }

    // ============================================
    // 📊 OBTENER OPCIONES DISPONIBLES
    // ============================================

    getAvailableTypes() {
        return Object.keys(CONFIG_DATA.types);
    }

    getAvailableMaterials() {
        return Object.keys(IMAGES_DB);
    }

    getAvailableColors() {
        const material = this.currentDesign.material;
        if (IMAGES_DB[material]) {
            return Object.keys(IMAGES_DB[material]);
        }
        return [];
    }

    getAvailableSizes() {
        const type = this.currentDesign.type;
        const config = CONFIG_DATA.types[type];
        return config?.hasSizes || [];
    }

    getAvailableDesigns() {
        return DESIGNS_DB;
    }
}

// Crear instancia global
export const designerManager = new DesignerManager();
