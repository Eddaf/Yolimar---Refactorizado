/**
 * 🛒 COMPONENTE CART DRAWER - Migrado del prototipo
 * Carrito de compras con UI completa
 */

import React from 'react';
import { useCart } from '../contexts/CartContext.js';
import { getPriceWithDiscount } from '../utils/priceCalculator.js';
import { COLOR_SYSTEM } from '../../config/colors.js';
import { CONFIG_DATA } from '../../config/constants.js';
import { getDesignNameFromPath } from '../utils/helpers.js';

// Iconos SVG
const Icons = {
    Trash2: (p) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    Phone: (p) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    Check: (p) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>
};

const CartDrawer = () => {
    const { 
        isCartOpen, 
        setIsCartOpen, 
        cart, 
        catalogCart, 
        removeFromCart, 
        removeFromCatalogCart, 
        updateCatalogQty, 
        updateCustomQty, 
        catalogTotal, 
        customTotal 
    } = useCart();

    if (!isCartOpen) return null;

    const finalTotal = customTotal + catalogTotal;
    const allItems = [];
    cart.forEach(item => { allItems.push({...item, source: 'custom'}); });
    catalogCart.forEach(item => { allItems.push({...item, source: 'catalog'}); });

    const handleWhatsAppCheckout = () => {
        if (allItems.length === 0) return;
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Header del PDF
        doc.setFillColor(13, 148, 136);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text('PEDIDO YOLIMAR', 105, 15, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 105, 25, { align: 'center' });
        doc.text(`Hora: ${new Date().toLocaleTimeString('es-ES')}`, 105, 32, { align: 'center' });
        
        let y = 50;
        
        // Tabla de productos
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('DETALLE DEL PEDIDO', 20, y);
        y += 10;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(200, 200, 200);
        doc.rect(20, y, 170, 7, 'F');
        doc.text('Descripción', 25, y + 5);
        doc.text('Cantidad', 100, y + 5);
        doc.text('Precio Unit.', 130, y + 5);
        doc.text('Subtotal', 160, y + 5);
        y += 10;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        
        allItems.forEach((item, idx) => {
            try {
                if (y > 250) {
                    doc.addPage();
                    y = 20;
                }
                
                const itemType = item.type || 'polera';
                const isCustom = item.source === 'custom';
                const size = isCustom ? item.details?.size : item.selectedSize;
                
                if (!size) return;
                
                const quantity = item.quantity || 1;
                const discountInfo = getPriceWithDiscount(itemType, size, quantity, isCustom);
                const subtotal = discountInfo.discountedPrice * quantity;
                
                let itemName = isCustom ? 'Polera Personalizada' : (item.name || 'Producto');
                
                let designName = 'N/A';
                if (isCustom && item.design) {
                    designName = getDesignNameFromPath(item.design);
                }
                
                let itemInfo = `${itemName}\nDiseño: ${designName} | Talla: ${size}`;
                if (isCustom && item.details?.color) {
                    itemInfo += ` | Color: ${item.details.color}`;
                } else if (!isCustom && item.selectedColor) {
                    itemInfo += ` | Color: ${COLOR_NAMES[item.selectedColor] || item.selectedColor}`;
                }
                
                doc.text(itemInfo, 25, y);
                doc.text(quantity.toString(), 100, y);
                doc.text(`Bs ${discountInfo.discountedPrice.toFixed(2)}`, 130, y);
                doc.text(`Bs ${subtotal.toFixed(2)}`, 160, y);
                
                if (discountInfo.hasDiscount) {
                    doc.setTextColor(0, 128, 0);
                    doc.text(`✓ ${discountInfo.discountPercentage}% OFF`, 25, y + 5);
                    doc.setTextColor(0, 0, 0);
                }
                
                y += 14;
                
            } catch (error) {
                console.error('Error procesando item en PDF:', error, item);
            }
        });
        
        // Total y footer
        y += 5;
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.3);
        doc.line(20, y, 190, y);
        y += 8;
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(13, 148, 136);
        doc.text('TOTAL:', 130, y);
        doc.text(`Bs ${finalTotal.toFixed(2)}`, 160, y);
        
        y += 15;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMACIÓN DE CONTACTO', 20, y);
        y += 7;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('📍 Feria Barrio Lindo Pasillo Potosi Puesto NRO. 1038', 25, y);
        y += 5;
        doc.text('Santa Cruz de la Sierra, Bolivia', 25, y);
        y += 5;
        doc.text('📞 WhatsApp: +591 76319999', 25, y);
        y += 5;
        doc.text('⏰ Horario: Miércoles y Sábado 5:00 - 18:00', 25, y);
        
        doc.save(`Pedido_YOLIMAR_${Date.now()}.pdf`);
        
        // Generar mensaje para WhatsApp
        let message = '*Hola Yolimar!* He generado un nuevo pedido:\n\n';
        
        allItems.forEach((item, idx) => {
            try {
                const itemType = item.type || 'polera';
                const isCustom = item.source === 'custom';
                const size = isCustom ? item.details?.size : item.selectedSize;
                
                if (!size) return;
                
                const quantity = item.quantity || 1;
                const discountInfo = getPriceWithDiscount(itemType, size, quantity, isCustom);
                const subtotal = discountInfo.discountedPrice * quantity;
                
                const itemName = isCustom ? 'Polera Personalizada' : (item.name || 'Producto');
                
                message += (idx + 1) + '. ' + itemName + '\n';
                
                if (isCustom && item.design) {
                    const designName = getDesignNameFromPath(item.design);
                    message += '   - Diseño: ' + designName + '\n';
                }
                
                message += '   - Cantidad: ' + quantity + ' x Bs ' + discountInfo.discountedPrice.toFixed(2);
                
                if (discountInfo.hasDiscount) {
                    message += ' (con ' + discountInfo.discountPercentage + '% descuento)';
                }
                
                message += ' = Bs ' + subtotal.toFixed(2) + '\n\n';
                
            } catch (error) {
                console.error('Error procesando item:', error, item);
            }
        });
        
        message += '\n*TOTAL: Bs ' + finalTotal.toFixed(2) + '*';
        message += '\n\n📍 Feria Barrio Lindo Pasillo Potosi Puesto NRO. 1038';
        message += '\n⏰ Miércoles y Sábado: 5:00 - 18:00';
        message += '\n\n✅ He descargado el PDF del pedido';
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = 'https://wa.me/59176319999?text=' + encodedMessage;
        
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
                {/* Header */}
                <div style={{ backgroundColor: COLOR_SYSTEM.primary, color: COLOR_SYSTEM.textOnPrimary }} className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-bold text-xl">Tu Carrito</h2>
                    <button onClick={() => setIsCartOpen(false)}><Icons.X className="w-6 h-6"/></button>
                </div>

                {/* Contenido del carrito */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {allItems.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <div className="text-6xl mb-4">🛒</div>
                            <p>Tu carrito está vacío</p>
                        </div>
                    ) : (
                        allItems.map((item, idx) => {
                            const itemType = item.type || 'polera';
                            const isCustom = item.source === 'custom';
                            const size = isCustom ? item.details.size : item.selectedSize;
                            const discountInfo = getPriceWithDiscount(itemType, size, item.quantity || 1, isCustom);
                            const subtotal = discountInfo.discountedPrice * (item.quantity || 1);

                            return (
                                <div key={item.cartItemId || idx} style={{ backgroundColor: isCustom ? COLOR_SYSTEM.primaryVeryLight : '#f3f4f6' }} className="flex gap-4 p-3 border rounded-xl items-center">
                                    {/* Imagen del producto */}
                                    <div className="w-16 h-20 bg-white rounded border overflow-hidden flex items-center justify-center">
                                        {isCustom ? (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <img 
                                                    src={IMAGES_DB[item.details.type]?.[item.details.color] || IMAGES_DB[item.details.type]?.blanco} 
                                                    className="w-full h-full object-contain polera-blend" 
                                                    alt="Producto" 
                                                />
                                            </div>
                                        ) : (
                                            <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                                        )}
                                    </div>

                                    {/* Información del producto */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span style={{ backgroundColor: isCustom ? '#a855f7' : COLOR_SYSTEM.primary, color: COLOR_SYSTEM.textOnPrimary }} className="text-xs px-2 py-0.5 rounded">{isCustom ? 'PERSONALIZADO' : 'CATÁLOGO'}</span>
                                            {discountInfo.hasDiscount && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-1">
                                                    <Icons.Check className="w-3 h-3" /> -{discountInfo.discountPercentage}%
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-sm leading-tight mt-1">{isCustom ? 'Polera Personalizada' : item.name}</h4>
                                        <div className="text-[10px] text-gray-500 space-y-0.5 mt-1">
                                            <p>Color: <strong>{isCustom ? item.details.color : COLOR_NAMES[item.selectedColor]}</strong> | Talla: <strong>{size}</strong></p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button onClick={() => isCustom ? updateCustomQty(item.cartItemId, Math.max(1, (item.quantity || 1) - 1)) : updateCatalogQty(item.cartItemId, -1)} className="w-6 h-6 bg-gray-200 rounded-full text-xs font-bold">-</button>
                                            <span className="text-sm font-bold">{item.quantity || 1}</span>
                                            <button onClick={() => isCustom ? updateCustomQty(item.cartItemId, (item.quantity || 1) + 1) : updateCatalogQty(item.cartItemId, 1)} className="w-6 h-6 bg-gray-200 rounded-full text-xs font-bold">+</button>
                                        </div>
                                        <p style={{ color: isCustom ? '#a855f7' : COLOR_SYSTEM.primary }} className="font-bold mt-1">
                                            x{item.quantity || 1} = Bs {subtotal.toFixed(2)}
                                            {discountInfo.hasDiscount && <span className="text-xs text-green-500 ml-1">✓</span>}
                                        </p>
                                    </div>

                                    {/* Botón eliminar */}
                                    <button onClick={() => isCustom ? removeFromCart(item.cartItemId) : removeFromCatalogCart(item.cartItemId)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg">
                                        <Icons.Trash2 className="w-5 h-5"/>
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer con total y checkout */}
                <div className="p-6 border-t bg-white">
                    <div className="flex justify-between font-bold text-xl mb-4">
                        <span>Total</span>
                        <span style={{ color: COLOR_SYSTEM.primary }}>Bs {finalTotal.toFixed(2)}</span>
                    </div>
                    <button onClick={handleWhatsAppCheckout} disabled={allItems.length === 0} style={{ backgroundColor: COLOR_SYSTEM.primary, color: COLOR_SYSTEM.textOnPrimary }} className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
                        <Icons.Phone className="w-5 h-5"/> Pedir por WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;