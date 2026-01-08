/**
 * 📦 MÓDULO DE CATÁLOGO
 * Gestiona la lógica del catálogo de productos
 */

import { CATALOG_PRODUCTS } from '../config/storeData.js';
import { COLOR_NAMES, COLOR_MAP } from '../config/colors.js';

/**
 * Clase para gestionar el catálogo
 */
export class CatalogManager {
    constructor(products = []) {
        this.products = products;
        this.filters = {
            type: null,
            color: null,
            priceRange: { min: 0, max: 1000 },
            inStock: true
        };
        this.sortBy = 'name'; // name, price, stock
        this.currentPage = 1;
        this.itemsPerPage = 12;
    }

    // ============================================
    // 🔍 BÚSQUEDA Y FILTRADO
    // ============================================

    setTypeFilter(type) {
        this.filters.type = type;
        this.currentPage = 1;
    }

    setColorFilter(color) {
        this.filters.color = color;
        this.currentPage = 1;
    }

    setPriceRange(min, max) {
        this.filters.priceRange = { min, max };
        this.currentPage = 1;
    }

    setStockFilter(inStock) {
        this.filters.inStock = inStock;
        this.currentPage = 1;
    }

    clearFilters() {
        this.filters = {
            type: null,
            color: null,
            priceRange: { min: 0, max: 1000 },
            inStock: true
        };
        this.currentPage = 1;
    }

    // ============================================
    // 🔀 ORDENAMIENTO
    // ============================================

    setSortBy(sortBy) {
        this.sortBy = sortBy;
        this.currentPage = 1;
    }

    // ============================================
    // 📊 OBTENER PRODUCTOS FILTRADOS
    // ============================================

    getFilteredProducts() {
        let filtered = [...this.products];

        // Filtrar por tipo
        if (this.filters.type) {
            filtered = filtered.filter(p => p.type === this.filters.type);
        }

        // Filtrar por color
        if (this.filters.color) {
            filtered = filtered.filter(p => {
                const colors = this.getColorsFromProduct(p);
                return colors.includes(this.filters.color);
            });
        }

        // Filtrar por rango de precio
        filtered = filtered.filter(p => {
            const minPrice = this.getMinPriceFromProduct(p);
            return minPrice >= this.filters.priceRange.min && minPrice <= this.filters.priceRange.max;
        });

        // Filtrar por stock
        if (this.filters.inStock) {
            filtered = filtered.filter(p => this.getTotalStockFromProduct(p) > 0);
        }

        // Ordenar
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'price':
                    return this.getMinPriceFromProduct(a) - this.getMinPriceFromProduct(b);
                case 'stock':
                    return this.getTotalStockFromProduct(b) - this.getTotalStockFromProduct(a);
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return filtered;
    }

    // ============================================
    // 📄 PAGINACIÓN
    // ============================================

    getPaginatedProducts() {
        const filtered = this.getFilteredProducts();
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return filtered.slice(start, end);
    }

    getTotalPages() {
        const filtered = this.getFilteredProducts();
        return Math.ceil(filtered.length / this.itemsPerPage);
    }

    setPage(page) {
        const maxPage = this.getTotalPages();
        this.currentPage = Math.max(1, Math.min(page, maxPage));
    }

    nextPage() {
        this.setPage(this.currentPage + 1);
    }

    prevPage() {
        this.setPage(this.currentPage - 1);
    }

    // ============================================
    // 🎨 INFORMACIÓN DE PRODUCTOS
    // ============================================

    getColorsFromProduct(product) {
        if (!product.variants || product.variants.length === 0) return [];
        return [...new Set(product.variants.map(v => v.color))];
    }

    getSizesFromProduct(product) {
        if (!product.variants || product.variants.length === 0) return [];
        return [...new Set(product.variants.map(v => v.size))];
    }

    getColorNamesFromProduct(product) {
        const colors = this.getColorsFromProduct(product);
        return colors.map(c => COLOR_NAMES[c] || c).join(', ');
    }

    getSizeNamesFromProduct(product) {
        const sizes = this.getSizesFromProduct(product);
        return sizes.join(', ');
    }

    getMinPriceFromProduct(product) {
        if (!product.variants || product.variants.length === 0) return 0;
        return Math.min(...product.variants.map(v => v.price));
    }

    getMaxPriceFromProduct(product) {
        if (!product.variants || product.variants.length === 0) return 0;
        return Math.max(...product.variants.map(v => v.price));
    }

    getTotalStockFromProduct(product) {
        if (!product.variants || product.variants.length === 0) return 0;
        return product.variants.reduce((sum, v) => sum + v.stock, 0);
    }

    // ============================================
    // 🔎 BÚSQUEDA POR ID
    // ============================================

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    getVariantByColorAndSize(product, color, size) {
        if (!product.variants) return null;
        return product.variants.find(v => v.color === color && v.size === size);
    }

    // ============================================
    // 📊 ESTADÍSTICAS
    // ============================================

    getStats() {
        return {
            totalProducts: this.products.length,
            filteredProducts: this.getFilteredProducts().length,
            totalVariants: this.products.reduce((sum, p) => sum + (p.variants?.length || 0), 0),
            totalStock: this.products.reduce((sum, p) => sum + this.getTotalStockFromProduct(p), 0),
            averagePrice: this.getAveragePrice(),
            priceRange: this.getPriceRange()
        };
    }

    getAveragePrice() {
        if (this.products.length === 0) return 0;
        const total = this.products.reduce((sum, p) => sum + this.getMinPriceFromProduct(p), 0);
        return total / this.products.length;
    }

    getPriceRange() {
        if (this.products.length === 0) return { min: 0, max: 0 };
        const prices = this.products.map(p => this.getMinPriceFromProduct(p));
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }

    // ============================================
    // 🏷️ OBTENER OPCIONES ÚNICAS
    // ============================================

    getUniqueTypes() {
        return [...new Set(this.products.map(p => p.type))];
    }

    getUniqueColors() {
        const colors = new Set();
        this.products.forEach(p => {
            this.getColorsFromProduct(p).forEach(c => colors.add(c));
        });
        return Array.from(colors);
    }

    getUniqueSizes() {
        const sizes = new Set();
        this.products.forEach(p => {
            this.getSizesFromProduct(p).forEach(s => sizes.add(s));
        });
        return Array.from(sizes);
    }
}

// Crear instancia global
export const catalogManager = new CatalogManager(CATALOG_PRODUCTS || []);
