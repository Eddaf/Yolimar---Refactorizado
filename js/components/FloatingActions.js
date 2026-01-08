/**
 * 🎯 COMPONENTE FLOATING ACTIONS - Migrado del prototipo
 * Botón flotante para generar reportes de catálogos
 */

import React, { useState } from 'react';
import { CONFIG_DATA, CATALOG_PRODUCTS } from '../../config/constants.js';
import { COLOR_SYSTEM } from '../../config/colors.js';
import { createPlaceholderImage, loadImageAsBase64, insertImageInPDF, preloadProductImages } from '../utils/imageLoader.js';

// Iconos SVG
const Icons = {
    Download: (p) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    Info: (p) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
};

const FloatingActions = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Componente de indicador de carga
    const LoadingIndicator = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl p-8 text-center shadow-2xl max-w-sm">
                <div className="mb-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mx-auto"></div>
                </div>
                <p className="text-gray-700 font-bold text-lg mb-2">{loadingMessage}</p>
                <p className="text-gray-500 text-sm mb-4">Cargando imágenes...</p>
                
                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                        style={{ width: `${loadingProgress}%` }}
                        className="bg-teal-600 h-full transition-all duration-300"
                    ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{loadingProgress}%</p>
            </div>
        </div>
    );

    /**
     * 🎯 GENERAR REPORTE POR TIPO DE PRODUCTO
     */
    const generateReportByType = async (type) => {
        const config = CONFIG_DATA.types[type];
        if (!config) return;

        setIsLoading(true);
        setIsExpanded(false);
        setLoadingMessage(`Preparando catálogo de ${config.name}...`);
        setLoadingProgress(0);

        try {
            console.log(`\n${'='.repeat(70)}`);
            console.log(`📄 GENERANDO REPORTE: ${config.name}`);
            console.log(`${'='.repeat(70)}\n`);
            
            const productosFiltrados = CATALOG_PRODUCTS.filter(p => p.type === type);
            console.log(`📦 Productos encontrados: ${productosFiltrados.length}`);
            
            setLoadingMessage(`Cargando imágenes (${config.name})...`);
            const imageMap = await preloadProductImages(productosFiltrados, (progress) => {
                setLoadingProgress(Math.round(progress.percentage * 0.7));
            });
            
            console.log(`✅ Imágenes precargadas: ${Object.keys(imageMap).length}`);
            
            setLoadingMessage(`Generando PDF...`);
            setLoadingProgress(70);
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Header
            doc.setFillColor(13, 148, 136);
            doc.rect(0, 0, 220, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.text(`Catálogo ${config.name} - YOLIMAR`, 105, 20, { align: 'center' });
            doc.setFontSize(11);
            doc.text(`Generado el ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 32, { align: 'center' });

            let y = 50;

            // Contenido del catálogo
            for (let idx = 0; idx < productosFiltrados.length; idx++) {
                const product = productosFiltrados[idx];
                
                if (y > 240) {
                    doc.addPage();
                    y = 20;
                }

                // Insertar imagen
                const imageData = imageMap[product.image];
                if (imageData) {
                    insertImageInPDF(doc, imageData, 20, y, 35, 35);
                } else {
                    console.warn(`⚠️ Imagen no encontrada en mapa: ${product.image}`);
                    const placeholder = createPlaceholderImage('SIN IMG');
                    doc.addImage(placeholder, 'PNG', 20, y, 35, 35);
                }

                // Información del producto
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text(product.name, 60, y + 5);
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.text(`📦 Código: ${product.code}`, 60, y + 11);
                
                const sizes = [...new Set(product.variants.map(v => v.size))].join(', ');
                const colors = [...new Set(product.variants.map(v => v.color))].map(c => COLOR_NAMES[c] || c).join(', ');
                const minPrice = Math.min(...product.variants.map(v => v.price));
                const maxPrice = Math.max(...product.variants.map(v => v.price));
                
                doc.text(`📏 Tallas: ${sizes}`, 60, y + 16);
                doc.text(`🎨 Colores: ${colors}`, 60, y + 21);
                doc.text(`💰 Precio: Bs ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`, 60, y + 26);

                if (config.discount.enabled) {
                    doc.setTextColor(0, 128, 0);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`✓ ${config.discount.description}`, 60, y + 31);
                }

                y = y + 42;
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.3);
                doc.line(20, y, 190, y);
                y += 6;
                
                setLoadingProgress(70 + Math.round((idx / productosFiltrados.length) * 30));
            }

            doc.save(`Catalogo_${config.name}_${Date.now()}.pdf`);
            console.log(`✅ PDF generado exitosamente: Catalogo_${config.name}_${Date.now()}.pdf`);
            
            setLoadingProgress(100);
            
        } catch (error) {
            console.error('❌ Error al generar PDF:', error);
            alert('Error al generar el catálogo. Por favor, intenta nuevamente.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
            setLoadingProgress(0);
        }
    };

    /**
     * 🎯 GENERAR REPORTE COMPLETO
     */
    const generateFullCatalogReport = async () => {
        setIsLoading(true);
        setIsExpanded(false);
        setLoadingMessage('Preparando catálogo completo...');
        setLoadingProgress(0);

        try {
            console.log(`\n${'='.repeat(70)}`);
            console.log('📄 GENERANDO REPORTE COMPLETO');
            console.log(`${'='.repeat(70)}\n`);
            
            setLoadingMessage('Cargando todas las imágenes...');
            const imageMap = await preloadProductImages(CATALOG_PRODUCTS, (progress) => {
                setLoadingProgress(Math.round(progress.percentage * 0.7));
            });
            
            console.log(`✅ Imágenes precargadas: ${Object.keys(imageMap).length}`);
            
            setLoadingMessage('Generando PDF completo...');
            setLoadingProgress(70);
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Header
            doc.setFillColor(13, 148, 136);
            doc.rect(0, 0, 220, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.text('Catálogo Completo - YOLIMAR', 105, 20, { align: 'center' });
            doc.setFontSize(11);
            doc.text(`Generado el ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 32, { align: 'center' });

            let y = 50;

            // Contenido completo
            for (let idx = 0; idx < CATALOG_PRODUCTS.length; idx++) {
                const product = CATALOG_PRODUCTS[idx];
                const config = CONFIG_DATA.types[product.type];
                if (!config) continue;

                if (y > 240) {
                    doc.addPage();
                    y = 20;
                }

                // Insertar imagen
                const imageData = imageMap[product.image];
                if (imageData) {
                    insertImageInPDF(doc, imageData, 20, y, 35, 35);
                } else {
                    console.warn(`⚠️ Imagen no encontrada en mapa: ${product.image}`);
                    const placeholder = createPlaceholderImage('SIN IMG');
                    doc.addImage(placeholder, 'PNG', 20, y, 35, 35);
                }

                // Información del producto
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text(product.name, 60, y + 5);
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.text(`Código: ${product.code}`, 60, y + 11);
                doc.text(`Tipo: ${config.name}`, 60, y + 16);
                
                const sizes = [...new Set(product.variants.map(v => v.size))].join(', ');
                const colors = [...new Set(product.variants.map(v => v.color))].map(c => COLOR_NAMES[c] || c).join(', ');
                const minPrice = Math.min(...product.variants.map(v => v.price));
                const maxPrice = Math.max(...product.variants.map(v => v.price));
                
                doc.text(`Tallas: ${sizes}`, 60, y + 21);
                doc.text(`Colores: ${colors}`, 60, y + 26);
                doc.text(`Precio: Bs ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`, 60, y + 31);

                if (config.discount.enabled) {
                    doc.setTextColor(0, 128, 0);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`✓ ${config.discount.description}`, 60, y + 36);
                }

                y = y + 47;
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.3);
                doc.line(20, y, 190, y);
                y += 6;
                
                setLoadingProgress(70 + Math.round((idx / CATALOG_PRODUCTS.length) * 30));
            }

            doc.save(`Catalogo_Completo_YOLIMAR_${Date.now()}.pdf`);
            console.log(`✅ PDF completo generado exitosamente`);
            
            setLoadingProgress(100);
            
        } catch (error) {
            console.error('❌ Error al generar PDF completo:', error);
            alert('Error al generar el catálogo completo. Por favor, intenta nuevamente.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
            setLoadingProgress(0);
        }
    };

    return (
        <>
            {isLoading && <LoadingIndicator />}
            
            <div className="fixed top-20 right-6 z-40">
                {isExpanded && (
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 w-72 mb-4 animate-slide-in border border-gray-100">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                <Icons.Download style={{ color: COLOR_SYSTEM.primary }} className="w-5 h-5" />
                                Descargar Catálogos
                            </h4>
                        </div>

                        {/* Botón catálogo completo */}
                        <button 
                            onClick={generateFullCatalogReport}
                            disabled={isLoading}
                            style={{ background: `linear-gradient(to right, #3b82f6, #2563eb)`, opacity: isLoading ? 0.5 : 1 }}
                            className="w-full text-white px-4 py-3 rounded-xl font-medium flex items-center gap-3 shadow-lg shadow-blue-500/25 transition-all mb-3 group"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Icons.Download className="w-5 h-5" />
                                </div>
                            )}
                            <div className="text-left">
                                <div className="font-bold text-sm">Catálogo Completo</div>
                                <div className="text-blue-100 text-xs">Todos los productos</div>
                            </div>
                        </button>

                        {/* Separador */}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Por tipo</span></div>
                        </div>

                        {/* Botones por tipo */}
                        <div className="space-y-2 mb-4">
                            {Object.keys(CONFIG_DATA.types).map(typeKey => (
                                <button 
                                    key={typeKey} 
                                    onClick={() => generateReportByType(typeKey)}
                                    disabled={isLoading}
                                    style={{ 
                                        borderColor: isLoading ? '#e5e7eb' : COLOR_SYSTEM.primaryLight, 
                                        backgroundColor: isLoading ? '#f3f4f6' : COLOR_SYSTEM.primaryVeryLight, 
                                        color: isLoading ? '#9ca3af' : COLOR_SYSTEM.primary 
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-all border"
                                >
                                    <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
                                        <Icons.Download className="w-4 h-4" style={{ color: isLoading ? '#9ca3af' : COLOR_SYSTEM.primary }} />
                                    </div>
                                    <span>{CONFIG_DATA.types[typeKey].name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Info de descuentos */}
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-3 rounded-xl text-xs font-medium text-center shadow-lg shadow-amber-500/25">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Icons.Info className="w-4 h-4" />
                                Descuentos por Volumen
                            </div>
                            <div className="text-amber-50 text-[10px] leading-relaxed">
                                3+ prendas = precio especial<br/>
                                Personalizados: 12+ unidades
                            </div>
                        </div>
                    </div>
                )}

                {/* Botón principal flotante */}
                <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    style={{ 
                        backgroundColor: isLoading ? '#f3f4f6' : COLOR_SYSTEM.secondary, 
                        borderColor: isLoading ? '#e5e7eb' : COLOR_SYSTEM.border, 
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
                    }}
                    className="bg-white/95 backdrop-blur-md shadow-xl p-3 rounded-xl border hover:shadow-2xl transition-all"
                    disabled={isLoading}
                >
                    {isExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isLoading ? '#9ca3af' : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    ) : (
                        <Icons.Download style={{ color: isLoading ? '#9ca3af' : COLOR_SYSTEM.primary }} className="w-6 h-6" />
                    )}
                </button>
            </div>
        </>
    );
};

export default FloatingActions;