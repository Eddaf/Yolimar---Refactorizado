/**
 * 📊 MÓDULO DE REPORTES
 * Gestiona la generación de reportes y exportación de datos
 */

import { adminDataManager } from './admin.js';
import { cartManager } from './cart.js';

/**
 * Clase para gestionar reportes
 */
export class ReportManager {
    constructor() {
        this.reports = [];
    }

    // ============================================
    // 📋 GENERAR REPORTES
    // ============================================

    generateSalesReport(startDate, endDate) {
        const orders = adminDataManager.orders.filter(o => {
            const orderDate = new Date(o.createdAt);
            return orderDate >= startDate && orderDate <= endDate;
        });

        const report = {
            id: Date.now(),
            type: 'sales',
            title: 'Reporte de Ventas',
            period: { startDate, endDate },
            data: {
                totalOrders: orders.length,
                totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
                averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length : 0,
                orders: orders
            },
            generatedAt: new Date().toISOString()
        };

        this.reports.push(report);
        return report;
    }

    generateInventoryReport() {
        const report = {
            id: Date.now(),
            type: 'inventory',
            title: 'Reporte de Inventario',
            data: {
                totalItems: 0,
                lowStockItems: [],
                outOfStockItems: []
            },
            generatedAt: new Date().toISOString()
        };

        this.reports.push(report);
        return report;
    }

    generateCustomerReport() {
        const report = {
            id: Date.now(),
            type: 'customer',
            title: 'Reporte de Clientes',
            data: {
                totalCustomers: adminDataManager.orders.length,
                repeatCustomers: 0,
                newCustomers: 0
            },
            generatedAt: new Date().toISOString()
        };

        this.reports.push(report);
        return report;
    }

    generateProductReport() {
        const report = {
            id: Date.now(),
            type: 'product',
            title: 'Reporte de Productos',
            data: {
                topProducts: [],
                slowMovingProducts: [],
                totalProducts: 0
            },
            generatedAt: new Date().toISOString()
        };

        this.reports.push(report);
        return report;
    }

    // ============================================
    // 📥 EXPORTAR A PDF
    // ============================================

    exportReportToPDF(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return null;

        // Aquí iría la lógica de jsPDF
        return {
            success: true,
            message: 'Reporte exportado a PDF',
            report: report
        };
    }

    // ============================================
    // 📊 EXPORTAR A CSV
    // ============================================

    exportReportToCSV(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return null;

        let csv = '';

        if (report.type === 'sales') {
            csv = this.generateSalesCSV(report);
        } else if (report.type === 'inventory') {
            csv = this.generateInventoryCSV(report);
        }

        return csv;
    }

    generateSalesCSV(report) {
        const headers = ['ID Pedido', 'Fecha', 'Total', 'Estado'];
        const rows = report.data.orders.map(o => [
            o.id,
            o.createdAt,
            o.total,
            o.status
        ]);

        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        return csv;
    }

    generateInventoryCSV(report) {
        const headers = ['Producto', 'Stock', 'Estado'];
        const rows = [];

        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        return csv;
    }

    // ============================================
    // 📋 GESTIÓN DE REPORTES
    // ============================================

    getReports() {
        return this.reports;
    }

    getReportById(id) {
        return this.reports.find(r => r.id === id);
    }

    deleteReport(id) {
        this.reports = this.reports.filter(r => r.id !== id);
    }

    clearReports() {
        this.reports = [];
    }

    // ============================================
    // 📊 ESTADÍSTICAS GENERALES
    // ============================================

    getGeneralStats() {
        const stats = adminDataManager.getStats();
        return {
            ...stats,
            cartItems: cartManager.getTotalItems(),
            cartValue: cartManager.getTotal()
        };
    }

    // ============================================
    // 📈 GRÁFICOS
    // ============================================

    getChartData(type) {
        switch (type) {
            case 'sales':
                return this.getSalesChartData();
            case 'products':
                return this.getProductsChartData();
            case 'revenue':
                return this.getRevenueChartData();
            default:
                return null;
        }
    }

    getSalesChartData() {
        const orders = adminDataManager.orders;
        const byStatus = {
            pending: orders.filter(o => o.status === 'pending').length,
            completed: orders.filter(o => o.status === 'completed').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length
        };

        return {
            labels: Object.keys(byStatus),
            data: Object.values(byStatus)
        };
    }

    getProductsChartData() {
        return {
            labels: ['Poleras', 'Sacos', 'Blusas', 'Soleras'],
            data: [0, 0, 0, 0]
        };
    }

    getRevenueChartData() {
        const orders = adminDataManager.orders;
        const byMonth = {};

        orders.forEach(o => {
            const date = new Date(o.createdAt);
            const month = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
            byMonth[month] = (byMonth[month] || 0) + (o.total || 0);
        });

        return {
            labels: Object.keys(byMonth),
            data: Object.values(byMonth)
        };
    }
}

// Crear instancia global
export const reportManager = new ReportManager();
