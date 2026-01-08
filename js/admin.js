/**
 * 👨‍💼 MÓDULO DE ADMINISTRACIÓN
 * Gestiona la lógica del panel administrativo
 */

import { ADMIN_USERS } from '../config/constants.js';

/**
 * Clase para gestionar autenticación
 */
export class AuthManager {
    constructor() {
        this.currentUser = this.loadUser();
        this.loginHistory = [];
    }

    // ============================================
    // 🔐 AUTENTICACIÓN
    // ============================================

    login(email, password) {
        const adminUser = ADMIN_USERS.find(u => u.email === email && u.password === password);
        
        if (adminUser) {
            const userData = {
                email: adminUser.email,
                name: adminUser.name,
                role: adminUser.role,
                loginTime: new Date().toISOString()
            };
            
            this.currentUser = userData;
            this.saveUser(userData);
            this.recordLogin(userData);
            
            return { success: true, user: userData };
        }
        
        return { success: false, error: 'Credenciales incorrectas' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('modadtf_admin_user');
        return { success: true };
    }

    // ============================================
    // 💾 PERSISTENCIA
    // ============================================

    saveUser(userData) {
        localStorage.setItem('modadtf_admin_user', JSON.stringify(userData));
    }

    loadUser() {
        try {
            const saved = localStorage.getItem('modadtf_admin_user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Error cargando usuario:', e);
            return null;
        }
    }

    // ============================================
    // 📋 HISTORIAL
    // ============================================

    recordLogin(userData) {
        this.loginHistory.push({
            ...userData,
            id: Date.now()
        });
    }

    getLoginHistory() {
        return this.loginHistory;
    }

    // ============================================
    // ✅ VERIFICACIÓN
    // ============================================

    isAuthenticated() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    isEditor() {
        return this.currentUser?.role === 'editor' || this.isAdmin();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // ============================================
    // 🔑 VALIDACIÓN DE CREDENCIALES
    // ============================================

    validateCredentials(email, password) {
        if (!email || !password) {
            return { valid: false, error: 'Email y contraseña requeridos' };
        }

        if (!email.includes('@')) {
            return { valid: false, error: 'Email inválido' };
        }

        if (password.length < 4) {
            return { valid: false, error: 'Contraseña muy corta' };
        }

        return { valid: true };
    }

    // ============================================
    // 👥 GESTIÓN DE USUARIOS
    // ============================================

    getAllUsers() {
        return ADMIN_USERS;
    }

    getUserByEmail(email) {
        return ADMIN_USERS.find(u => u.email === email);
    }

    getUsersByRole(role) {
        return ADMIN_USERS.filter(u => u.role === role);
    }
}

/**
 * Clase para gestionar datos administrativos
 */
export class AdminDataManager {
    constructor() {
        this.orders = this.loadOrders();
        this.reports = this.loadReports();
        this.settings = this.loadSettings();
    }

    // ============================================
    // 📦 GESTIÓN DE PEDIDOS
    // ============================================

    loadOrders() {
        try {
            const saved = localStorage.getItem('modadtf_orders');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error cargando pedidos:', e);
            return [];
        }
    }

    saveOrders() {
        localStorage.setItem('modadtf_orders', JSON.stringify(this.orders));
    }

    addOrder(order) {
        const newOrder = {
            ...order,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            status: 'pending'
        };
        this.orders.push(newOrder);
        this.saveOrders();
        return newOrder;
    }

    getOrders() {
        return this.orders;
    }

    getOrderById(id) {
        return this.orders.find(o => o.id === id);
    }

    updateOrderStatus(id, status) {
        const order = this.getOrderById(id);
        if (order) {
            order.status = status;
            order.updatedAt = new Date().toISOString();
            this.saveOrders();
            return order;
        }
        return null;
    }

    deleteOrder(id) {
        this.orders = this.orders.filter(o => o.id !== id);
        this.saveOrders();
    }

    // ============================================
    // 📊 REPORTES
    // ============================================

    loadReports() {
        try {
            const saved = localStorage.getItem('modadtf_reports');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error cargando reportes:', e);
            return [];
        }
    }

    saveReports() {
        localStorage.setItem('modadtf_reports', JSON.stringify(this.reports));
    }

    generateReport(type, data) {
        const report = {
            id: Date.now(),
            type: type,
            data: data,
            createdAt: new Date().toISOString(),
            createdBy: 'admin'
        };
        this.reports.push(report);
        this.saveReports();
        return report;
    }

    getReports() {
        return this.reports;
    }

    getReportById(id) {
        return this.reports.find(r => r.id === id);
    }

    deleteReport(id) {
        this.reports = this.reports.filter(r => r.id !== id);
        this.saveReports();
    }

    // ============================================
    // ⚙️ CONFIGURACIÓN
    // ============================================

    loadSettings() {
        try {
            const saved = localStorage.getItem('modadtf_settings');
            return saved ? JSON.parse(saved) : this.getDefaultSettings();
        } catch (e) {
            console.error('Error cargando configuración:', e);
            return this.getDefaultSettings();
        }
    }

    saveSettings() {
        localStorage.setItem('modadtf_settings', JSON.stringify(this.settings));
    }

    getDefaultSettings() {
        return {
            storeName: 'YOLIMAR',
            storeEmail: 'info@yolimar.pe',
            storePhone: '+51 999 999 999',
            taxRate: 0.18,
            shippingCost: 15,
            freeShippingThreshold: 200,
            currency: 'S/.',
            theme: 'light'
        };
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        return this.settings;
    }

    getSettings() {
        return this.settings;
    }

    // ============================================
    // 📈 ESTADÍSTICAS
    // ============================================

    getStats() {
        const totalOrders = this.orders.length;
        const totalRevenue = this.orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingOrders = this.orders.filter(o => o.status === 'pending').length;
        const completedOrders = this.orders.filter(o => o.status === 'completed').length;

        return {
            totalOrders,
            totalRevenue,
            pendingOrders,
            completedOrders,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            conversionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
        };
    }

    // ============================================
    // 📥 EXPORTAR DATOS
    // ============================================

    exportAsJSON() {
        return {
            orders: this.orders,
            reports: this.reports,
            settings: this.settings,
            stats: this.getStats(),
            exportedAt: new Date().toISOString()
        };
    }

    exportOrdersAsCSV() {
        if (this.orders.length === 0) return '';

        const headers = ['ID', 'Fecha', 'Total', 'Estado', 'Items'];
        const rows = this.orders.map(o => [
            o.id,
            o.createdAt,
            o.total,
            o.status,
            o.items?.length || 0
        ]);

        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        return csv;
    }
}

// Crear instancias globales
export const authManager = new AuthManager();
export const adminDataManager = new AdminDataManager();
