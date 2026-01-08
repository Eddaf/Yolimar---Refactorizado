/**
 * 🛒 CONTEXTO DE CARRITO
 * Gestiona el estado global del carrito de compra
 * Se integra con React Context API
 */

const { createContext, useContext, useState, useEffect } = React;

import { cartManager } from '../utils/cartManager.js';
import { getPriceWithDiscount } from '../utils/priceCalculator.js';

/**
 * Crear contexto de carrito
 */
export const CartContext = createContext();

/**
 * Proveedor de carrito
 */
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [catalogCart, setCatalogCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartUpdated, setCartUpdated] = useState(0);

    // ============================================
    // 📥 CARGAR CARRITO AL INICIAR
    // ============================================

    useEffect(() => {
        const savedCustom = localStorage.getItem('modadtf_cart_custom');
        const savedCatalog = localStorage.getItem('modadtf_cart_catalog');
        
        if (savedCustom) {
            try {
                setCart(JSON.parse(savedCustom));
            } catch (e) {
                console.error('Error cargando carrito personalizado:', e);
            }
        }
        
        if (savedCatalog) {
            try {
                setCatalogCart(JSON.parse(savedCatalog));
            } catch (e) {
                console.error('Error cargando carrito de catálogo:', e);
            }
        }
    }, []);

    // ============================================
    // 💾 GUARDAR CARRITO
    // ============================================

    useEffect(() => {
        localStorage.setItem('modadtf_cart_custom', JSON.stringify(cart));
        localStorage.setItem('modadtf_cart_catalog', JSON.stringify(catalogCart));
    }, [cart, catalogCart]);

    // ============================================
    // ➕ AGREGAR ITEMS
    // ============================================

    const addToCart = (product) => {
        const newItem = {
            ...product,
            cartItemId: Date.now()
        };
        setCart(prev => [...prev, newItem]);
        setIsCartOpen(true);
        setCartUpdated(prev => prev + 1);
    };

    const addToCatalogCart = (product, color, size, qty) => {
        const existing = catalogCart.find(
            i => i.id === product.id && i.selectedColor === color && i.selectedSize === size
        );
        
        if (existing) {
            setCatalogCart(prev =>
                prev.map(i =>
                    i.id === product.id && i.selectedColor === color && i.selectedSize === size
                        ? { ...i, quantity: i.quantity + qty }
                        : i
                )
            );
        } else {
            setCatalogCart(prev => [
                ...prev,
                {
                    ...product,
                    selectedColor: color,
                    selectedSize: size,
                    quantity: qty,
                    cartItemId: Date.now()
                }
            ]);
        }
        
        setIsCartOpen(true);
        setCartUpdated(prev => prev + 1);
    };

    // ============================================
    // ❌ ELIMINAR ITEMS
    // ============================================

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(i => i.cartItemId !== id));
        setCartUpdated(prev => prev + 1);
    };

    const removeFromCatalogCart = (id) => {
        setCatalogCart(prev => prev.filter(i => i.cartItemId !== id));
        setCartUpdated(prev => prev + 1);
    };

    // ============================================
    // 📝 ACTUALIZAR ITEMS
    // ============================================

    const updateCatalogQty = (id, delta) => {
        setCatalogCart(prev =>
            prev
                .map(i => {
                    if (i.cartItemId === id) {
                        const newQty = i.quantity + delta;
                        return newQty <= 0 ? null : { ...i, quantity: newQty };
                    }
                    return i;
                })
                .filter(Boolean)
        );
        setCartUpdated(prev => prev + 1);
    };

    const updateCustomQty = (id, quantity) => {
        setCart(prev =>
            prev.map(i =>
                i.cartItemId === id ? { ...i, quantity: Math.max(1, quantity) } : i
            )
        );
        setCartUpdated(prev => prev + 1);
    };

    const updateCatalogItem = (id, updates) => {
        setCatalogCart(prev =>
            prev.map(i =>
                i.cartItemId === id ? { ...i, ...updates } : i
            )
        );
        setCartUpdated(prev => prev + 1);
    };

    // ============================================
    // 💰 CÁLCULOS
    // ============================================

    const customTotal = cart.reduce((acc, item) => {
        if (item.isCustom) {
            const type = item.type || 'polera';
            const discountInfo = getPriceWithDiscount(type, item.details.size, item.quantity || 1, true);
            return acc + (discountInfo.discountedPrice * (item.quantity || 1));
        }
        return acc + (item.price || 0);
    }, 0);

    const catalogTotal = catalogCart.reduce((acc, item) => {
        const type = item.type || 'polera';
        const discountInfo = getPriceWithDiscount(type, item.selectedSize, item.quantity, false);
        return acc + (discountInfo.discountedPrice * item.quantity);
    }, 0);

    const allCartItems = [...cart, ...catalogCart];
    const totalItems = allCartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = customTotal + catalogTotal;
    const totalTax = totalPrice * 0.18;
    const totalWithTax = totalPrice + totalTax;

    // ============================================
    // 📊 INFORMACIÓN
    // ============================================

    const isEmpty = () => {
        return cart.length === 0 && catalogCart.length === 0;
    };

    const getCartSummary = () => {
        return {
            customItems: cart.length,
            catalogItems: catalogCart.length,
            totalItems,
            customTotal,
            catalogTotal,
            subtotal: totalPrice,
            tax: totalTax,
            total: totalWithTax
        };
    };

    const getDetailedSummary = () => {
        return {
            custom: cart.map(item => ({
                ...item,
                subtotal: (item.price || 0) * (item.quantity || 1)
            })),
            catalog: catalogCart.map(item => ({
                ...item,
                subtotal: (item.price || 0) * item.quantity
            })),
            totals: {
                customTotal,
                catalogTotal,
                subtotal: totalPrice,
                tax: totalTax,
                total: totalWithTax
            }
        };
    };

    // ============================================
    // 🧹 LIMPIAR
    // ============================================

    const clearCart = () => {
        setCart([]);
        setCatalogCart([]);
        setCartUpdated(prev => prev + 1);
    };

    const clearCustomCart = () => {
        setCart([]);
        setCartUpdated(prev => prev + 1);
    };

    const clearCatalogCart = () => {
        setCatalogCart([]);
        setCartUpdated(prev => prev + 1);
    };

    // ============================================
    // 📋 CONTEXTO
    // ============================================

    const value = {
        // Estado
        cart,
        catalogCart,
        isCartOpen,
        setIsCartOpen,
        cartUpdated,

        // Métodos - Agregar
        addToCart,
        addToCatalogCart,

        // Métodos - Eliminar
        removeFromCart,
        removeFromCatalogCart,

        // Métodos - Actualizar
        updateCatalogQty,
        updateCustomQty,
        updateCatalogItem,

        // Métodos - Información
        isEmpty,
        getCartSummary,
        getDetailedSummary,

        // Métodos - Limpiar
        clearCart,
        clearCustomCart,
        clearCatalogCart,

        // Totales
        customTotal,
        catalogTotal,
        allCartItems,
        totalItems,
        totalPrice,
        totalTax,
        totalWithTax
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

/**
 * Hook para usar el contexto de carrito
 */
export const useCart = () => {
    const context = useContext(CartContext);
    
    if (!context) {
        throw new Error('useCart debe ser usado dentro de CartProvider');
    }
    
    return context;
};

export default CartContext;
