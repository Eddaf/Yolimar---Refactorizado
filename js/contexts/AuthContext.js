/**
 * 🔐 CONTEXTO DE AUTENTICACIÓN
 * Gestiona el estado de autenticación de usuarios administradores
 * Se integra con React Context API
 */

const { createContext, useContext, useState, useEffect } = React;

import { ADMIN_USERS } from '../../config/constants.js';

/**
 * Crear contexto de autenticación
 */
export const AuthContext = createContext();

/**
 * Proveedor de autenticación
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ============================================
    // 📥 CARGAR USUARIO AL INICIAR
    // ============================================

    useEffect(() => {
        const savedUser = localStorage.getItem('modadtf_admin_user');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
            } catch (e) {
                console.error('Error cargando usuario:', e);
                localStorage.removeItem('modadtf_admin_user');
            }
        }
        setIsLoading(false);
    }, []);

    // ============================================
    // 🔑 AUTENTICACIÓN
    // ============================================

    const login = (email, password) => {
        setError(null);
        
        // Validar credenciales
        const validation = validateCredentials(email, password);
        if (!validation.valid) {
            setError(validation.error);
            return { success: false, error: validation.error };
        }

        // Buscar usuario
        const adminUser = ADMIN_USERS.find(u => u.email === email && u.password === password);
        
        if (adminUser) {
            const userData = {
                email: adminUser.email,
                name: adminUser.name,
                role: adminUser.role,
                loginTime: new Date().toISOString()
            };
            
            setUser(userData);
            localStorage.setItem('modadtf_admin_user', JSON.stringify(userData));
            setShowLogin(false);
            setError(null);
            
            return { success: true, user: userData };
        }
        
        const errorMsg = 'Credenciales incorrectas';
        setError(errorMsg);
        return { success: false, error: errorMsg };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('modadtf_admin_user');
        setError(null);
        window.location.href = '#/';
    };

    // ============================================
    // ✅ VERIFICACIÓN
    // ============================================

    const isAuthenticated = () => {
        return user !== null;
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const isEditor = () => {
        return user?.role === 'editor' || isAdmin();
    };

    const hasPermission = (requiredRole) => {
        if (!user) return false;
        if (requiredRole === 'admin') return isAdmin();
        if (requiredRole === 'editor') return isEditor();
        return true;
    };

    // ============================================
    // 🔐 VALIDACIÓN
    // ============================================

    const validateCredentials = (email, password) => {
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
    };

    // ============================================
    // 👤 INFORMACIÓN DE USUARIO
    // ============================================

    const getCurrentUser = () => {
        return user;
    };

    const getUserInfo = () => {
        if (!user) return null;
        return {
            email: user.email,
            name: user.name,
            role: user.role,
            loginTime: user.loginTime,
            isAdmin: isAdmin(),
            isEditor: isEditor()
        };
    };

    // ============================================
    // 🔄 ACTUALIZAR USUARIO
    // ============================================

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('modadtf_admin_user', JSON.stringify(updatedUser));
        return updatedUser;
    };

    // ============================================
    // 📋 CONTEXTO
    // ============================================

    const value = {
        // Estado
        user,
        isLoading,
        error,
        showLogin,
        setShowLogin,

        // Métodos
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isEditor,
        hasPermission,
        getCurrentUser,
        getUserInfo,
        updateUser,
        validateCredentials
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    
    return context;
};

export default AuthContext;
