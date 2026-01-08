/**
 * 🌍 CONTEXTO GLOBAL DE APLICACIÓN
 * Gestiona el estado global de la aplicación
 * Integra autenticación, carrito y configuración
 */

const { createContext, useContext, useState, useEffect } = React;

import { COLOR_SYSTEM } from '../../config/colors.js';
import { STORE_INFO } from '../../config/storeData.js';

/**
 * Crear contexto global
 */
export const AppContext = createContext();

/**
 * Proveedor global de aplicación
 */
export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('es');
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [appSettings, setAppSettings] = useState({});

    // ============================================
    // 📥 CARGAR CONFIGURACIÓN AL INICIAR
    // ============================================

    useEffect(() => {
        const savedTheme = localStorage.getItem('modadtf_theme') || 'light';
        const savedLanguage = localStorage.getItem('modadtf_language') || 'es';
        const savedSettings = localStorage.getItem('modadtf_settings');

        setTheme(savedTheme);
        setLanguage(savedLanguage);

        if (savedSettings) {
            try {
                setAppSettings(JSON.parse(savedSettings));
            } catch (e) {
                console.error('Error cargando configuración:', e);
            }
        }
    }, []);

    // ============================================
    // 🎨 TEMA
    // ============================================

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('modadtf_theme', newTheme);
        applyTheme(newTheme);
    };

    const setThemeMode = (mode) => {
        setTheme(mode);
        localStorage.setItem('modadtf_theme', mode);
        applyTheme(mode);
    };

    const applyTheme = (mode) => {
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const isDarkMode = () => theme === 'dark';

    // ============================================
    // 🌐 IDIOMA
    // ============================================

    const setLanguageMode = (lang) => {
        setLanguage(lang);
        localStorage.setItem('modadtf_language', lang);
    };

    const getCurrentLanguage = () => language;

    // ============================================
    // 🔔 NOTIFICACIONES
    // ============================================

    const addNotification = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        const notification = {
            id,
            message,
            type, // 'success', 'error', 'warning', 'info'
            timestamp: new Date().toISOString()
        };

        setNotifications(prev => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const showSuccess = (message, duration = 3000) => {
        return addNotification(message, 'success', duration);
    };

    const showError = (message, duration = 5000) => {
        return addNotification(message, 'error', duration);
    };

    const showWarning = (message, duration = 4000) => {
        return addNotification(message, 'warning', duration);
    };

    const showInfo = (message, duration = 3000) => {
        return addNotification(message, 'info', duration);
    };

    // ============================================
    // ⚙️ CONFIGURACIÓN
    // ============================================

    const updateSettings = (newSettings) => {
        const updated = { ...appSettings, ...newSettings };
        setAppSettings(updated);
        localStorage.setItem('modadtf_settings', JSON.stringify(updated));
        return updated;
    };

    const getSettings = () => appSettings;

    const getSetting = (key, defaultValue = null) => {
        return appSettings[key] !== undefined ? appSettings[key] : defaultValue;
    };

    // ============================================
    // 📊 INFORMACIÓN DE TIENDA
    // ============================================

    const getStoreInfo = () => {
        return {
            name: STORE_INFO?.name || 'YOLIMAR',
            email: STORE_INFO?.email || 'info@yolimar.pe',
            phone: STORE_INFO?.phone || '+51 999 999 999',
            address: STORE_INFO?.address || '',
            currency: STORE_INFO?.currency || 'S/.',
            taxRate: STORE_INFO?.taxRate || 0.18
        };
    };

    const getStoreName = () => STORE_INFO?.name || 'YOLIMAR';

    const getStoreEmail = () => STORE_INFO?.email || 'info@yolimar.pe';

    const getStorePhone = () => STORE_INFO?.phone || '+51 999 999 999';

    // ============================================
    // 🎨 COLORES
    // ============================================

    const getColors = () => COLOR_SYSTEM;

    const getPrimaryColor = () => COLOR_SYSTEM.primary;

    const getColorByName = (name) => COLOR_SYSTEM[name] || COLOR_SYSTEM.primary;

    // ============================================
    // ⏳ CARGA
    // ============================================

    const setLoading = (loading) => {
        setIsLoading(loading);
    };

    const isAppLoading = () => isLoading;

    // ============================================
    // 🔄 ESTADO GENERAL
    // ============================================

    const getAppState = () => {
        return {
            theme,
            language,
            notifications,
            isLoading,
            settings: appSettings
        };
    };

    const resetAppState = () => {
        setTheme('light');
        setLanguage('es');
        setNotifications([]);
        setIsLoading(false);
        setAppSettings({});
        localStorage.removeItem('modadtf_theme');
        localStorage.removeItem('modadtf_language');
        localStorage.removeItem('modadtf_settings');
    };

    // ============================================
    // 📋 CONTEXTO
    // ============================================

    const value = {
        // Estado
        theme,
        language,
        notifications,
        isLoading,
        appSettings,

        // Tema
        toggleTheme,
        setThemeMode,
        isDarkMode,

        // Idioma
        setLanguageMode,
        getCurrentLanguage,

        // Notificaciones
        addNotification,
        removeNotification,
        clearNotifications,
        showSuccess,
        showError,
        showWarning,
        showInfo,

        // Configuración
        updateSettings,
        getSettings,
        getSetting,

        // Información de tienda
        getStoreInfo,
        getStoreName,
        getStoreEmail,
        getStorePhone,

        // Colores
        getColors,
        getPrimaryColor,
        getColorByName,

        // Carga
        setLoading,
        isAppLoading,

        // Estado general
        getAppState,
        resetAppState
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

/**
 * Hook para usar el contexto global
 */
export const useApp = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('useApp debe ser usado dentro de AppProvider');
    }

    return context;
};

export default AppContext;
