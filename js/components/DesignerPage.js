/**
 * 🎨 COMPONENTE DESIGNER PAGE - Migrado del prototipo
 * Página completa del diseñador personalizado
 */

import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext.js';
import { designerManager } from '../designer.js';
import { IMAGES_DB, DESIGNS_DB, CONFIG_DATA, SIZE_GROUPS } from '../../config/constants.js';
import { COLOR_MAP, COLOR_NAMES, COLOR_SYSTEM } from '../../config/colors.js';

// Componente de vista previa de producto
const ProductPreview = ({ type, color, design, containerClass, logoSize }) => {
    const activeImg = (IMAGES_DB[type] && IMAGES_DB[type][color]) ? IMAGES_DB[type][color] : (IMAGES_DB[type] ? IMAGES_DB[type].blanco : null);
    
    return (
        <div className={"relative flex items-center justify-center overflow-hidden " + (containerClass || "")}>
            {activeImg ? (
                <img src={activeImg} className="w-full h-full object-contain polera-blend" alt="Producto" />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl">👕</span>
                </div>
            )}
            {design && (
                <div className="absolute top-[35%] w-full flex justify-center pointer-events-none">
                    <img src={design} className={(logoSize || "w-44 h-44") + " object-contain"} alt="Estampado" />
                </div>
            )}
        </div>
    );
};

const DesignerPage = () => {
    const { addToCart } = useCart();
    const [selectedType, setSelectedType] = useState('Algodon');
    const [selectedColor, setSelectedColor] = useState('blanco');
    const [selectedDesign, setSelectedDesign] = useState(DESIGNS_DB[0].img);
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('tipo');

    // Calcular precio con descuento
    const getPriceWithDiscount = (type, size, quantity, isCustom = false) => {
        const basePrice = 60; // Precio base para personalizados
        const discountPercentage = 5;
        const minQuantity = 12;

        if (quantity >= minQuantity) {
            const discountAmount = basePrice * (discountPercentage / 100);
            return {
                basePrice,
                discountedPrice: basePrice - discountAmount,
                discountPercentage,
                hasDiscount: true,
                savings: discountAmount * quantity,
                minQuantity
            };
        }

        return {
            basePrice,
            discountedPrice: basePrice,
            discountPercentage: 0,
            hasDiscount: false,
            savings: 0,
            minQuantity
        };
    };

    const discountInfo = getPriceWithDiscount(selectedType.toLowerCase(), selectedSize, quantity, true);

    const handleAddToCart = () => {
        const product = {
            id: `custom-${Date.now()}`,
            name: `Polera Personalizada (${selectedType})`,
            type: selectedType.toLowerCase(),
            isCustom: true,
            image: IMAGES_DB[selectedType][selectedColor],
            design: selectedDesign,
            quantity: quantity,
            details: { 
                type: selectedType, 
                color: selectedColor, 
                size: selectedSize, 
                design: selectedDesign 
            }
        };
        addToCart(product);
    };

    // Iconos SVG
    const Icons = {
        Shirt: (p) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>,
        ShoppingBag: (p) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
        Check: (p) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Vista previa del producto */}
                <div className="sticky top-24 bg-gray-50 rounded-3xl p-8 flex flex-col items-center">
                    <ProductPreview 
                        type={selectedType} 
                        color={selectedColor} 
                        design={selectedDesign} 
                        containerClass="w-full aspect-square max-w-md"
                    />
                    <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-bold">Precio Unit.</p>
                            <p className="text-2xl font-black text-gray-800">
                                {discountInfo.discountedPrice.toFixed(2)} <span className="text-sm font-normal text-gray-400">Bs.</span>
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                            <p style={{ color: COLOR_SYSTEM.primary }} className="text-2xl font-black">
                                {(discountInfo.discountedPrice * quantity).toFixed(2)} <span className="text-sm font-normal text-gray-400">Bs.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Panel de personalización */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-black mb-2 text-gray-900">Personaliza tu estilo</h1>
                        <p className="text-gray-500">Elige cada detalle de tu prenda y nosotros la creamos por ti.</p>
                    </div>

                    {/* Tabs de navegación */}
                    <div className="flex p-1 bg-gray-100 rounded-2xl">
                        {['tipo', 'color', 'diseño', 'talla'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === tab ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Contenido de las tabs */}
                    <div className="min-h-[300px]">
                        {activeTab === 'tipo' && (
                            <div className="grid grid-cols-3 gap-4 animate-slide-in">
                                {Object.keys(IMAGES_DB).map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`p-4 rounded-2xl border-2 transition-all ${selectedType === type ? 'border-teal-500 bg-teal-50' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <Icons.Shirt className={`w-8 h-8 mx-auto mb-2 ${selectedType === type ? 'text-teal-600' : 'text-gray-400'}`} />
                                        <span className="block text-xs font-bold text-center">{type}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeTab === 'color' && (
                            <div className="grid grid-cols-4 gap-4 animate-slide-in">
                                {Object.keys(IMAGES_DB[selectedType]).map(color => (
                                    <button 
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`group flex flex-col items-center gap-2`}
                                    >
                                        <div 
                                            style={{ backgroundColor: COLOR_MAP[color] || color }}
                                            className={`w-12 h-12 rounded-full border-4 shadow-sm transition-transform group-hover:scale-110 ${selectedColor === color ? 'border-teal-500 scale-110' : 'border-white'}`}
                                        />
                                        <span className="text-[10px] font-bold uppercase text-gray-500">{COLOR_NAMES[color] || color}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeTab === 'diseño' && (
                            <div className="grid grid-cols-4 gap-3 animate-slide-in">
                                {DESIGNS_DB.map(design => (
                                    <button 
                                        key={design.id}
                                        onClick={() => setSelectedDesign(design.img)}
                                        className={`aspect-square p-2 rounded-xl border-2 transition-all overflow-hidden ${selectedDesign === design.img ? 'border-teal-500 bg-teal-50' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <img src={design.img} className="w-full h-full object-contain" alt={design.name} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeTab === 'talla' && (
                            <div className="grid grid-cols-3 gap-3 animate-slide-in">
                                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-4 rounded-xl border-2 font-bold transition-all ${selectedSize === size ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Panel de cantidad y acciones */}
                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <span className="font-bold text-gray-700">Cantidad:</span>
                            <div className="flex items-center gap-4 bg-gray-100 p-1 rounded-xl">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-teal-600 font-bold">-</button>
                                <span className="w-8 text-center font-black">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-teal-600 font-bold">+</button>
                            </div>
                        </div>
                        
                        {discountInfo.hasDiscount && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                                <div className="bg-green-500 text-white p-1 rounded-full"><Icons.Check className="w-3 h-3"/></div>
                                <p className="text-sm text-green-700 font-medium">¡Descuento aplicado! Ahorras Bs. {discountInfo.savings.toFixed(2)}</p>
                            </div>
                        )}

                        <button 
                            onClick={handleAddToCart}
                            style={{ backgroundColor: COLOR_SYSTEM.primary }}
                            className="w-full py-5 text-white font-black text-lg rounded-2xl shadow-xl shadow-teal-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
                        >
                            <Icons.ShoppingBag className="w-6 h-6" />
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignerPage;