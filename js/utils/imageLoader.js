/**
 * 🖼️ CARGADOR DE IMÁGENES - Versión simplificada y funcional
 * Basado en el prototipo funcional
 */

/**
 * 🎨 Crear imagen placeholder en Base64
 */
export const createPlaceholderImage = (text = 'SIN IMAGEN', width = 200, height = 200) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
    
    ctx.fillStyle = '#999';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    
    return canvas.toDataURL('image/png');
};

/**
 * 🔗 Construir URL - Optimizado para rutas relativas
 */
export const getAbsoluteImageUrl = (relativePath) => {
    if (!relativePath) return null;
    
    // Si ya es URL absoluta (http/https), retornarla
    if (relativePath.startsWith('http')) return relativePath;
    
    // Para rutas relativas, usarlas directamente
    // El navegador las resolverá automáticamente desde la carpeta del proyecto
    console.log(`📍 Usando ruta relativa: ${relativePath}`);
    
    return relativePath;
};

/**
 * ✅ Cargar imagen con reintentos y mejor manejo de errores
 */
export const loadImageAsBase64 = (imageUrl, retries = 5, timeout = 15000) => {
    return new Promise((resolve) => {
        if (!imageUrl) {
            console.warn('❌ URL de imagen vacía');
            resolve({
                success: false,
                base64: createPlaceholderImage('URL VACÍA'),
                error: 'URL vacía',
                originalUrl: imageUrl
            });
            return;
        }

        const absoluteUrl = getAbsoluteImageUrl(imageUrl);
        console.log(`📥 Intentando cargar: ${absoluteUrl}`);

        const attemptLoad = (attempt = 1) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            let timeoutId = setTimeout(() => {
                console.warn(`⏱️ Timeout en intento ${attempt}/${retries}: ${absoluteUrl}`);
                if (attempt < retries) {
                    attemptLoad(attempt + 1);
                } else {
                    resolve({
                        success: false,
                        base64: createPlaceholderImage('TIMEOUT'),
                        error: 'Timeout después de reintentos',
                        originalUrl: imageUrl,
                        attempts: retries
                    });
                }
            }, timeout);

            img.onload = () => {
                clearTimeout(timeoutId);
                console.log(`✅ Imagen cargada exitosamente: ${absoluteUrl}`);
                
                try {
                    const canvas = document.createElement('canvas');
                    const maxSize = 400;
                    
                    let { width, height } = img;
                    if (width > height) {
                        if (width > maxSize) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width = (width * maxSize) / height;
                            height = maxSize;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const base64 = canvas.toDataURL('image/jpeg', 0.95);
                    
                    if (base64 && base64.length > 100) {
                        resolve({
                            success: true,
                            base64,
                            originalUrl: imageUrl,
                            absoluteUrl,
                            dimensions: { width, height }
                        });
                    } else {
                        throw new Error('Base64 inválido o vacío');
                    }
                } catch (e) {
                    console.error('❌ Error al procesar imagen:', e);
                    resolve({
                        success: false,
                        base64: createPlaceholderImage('ERROR PROC'),
                        error: e.message,
                        originalUrl: imageUrl
                    });
                }
            };

            img.onerror = (error) => {
                clearTimeout(timeoutId);
                console.warn(`⚠️ Error en intento ${attempt}/${retries}: ${absoluteUrl}`);
                
                if (attempt < retries) {
                    console.log(`🔄 Reintentando... (${attempt + 1}/${retries})`);
                    setTimeout(() => attemptLoad(attempt + 1), 1500);
                } else {
                    resolve({
                        success: false,
                        base64: createPlaceholderImage('ERROR CARGA'),
                        error: 'Error de carga después de reintentos',
                        originalUrl: imageUrl,
                        attempts: retries
                    });
                }
            };

            img.src = absoluteUrl;
        };

        attemptLoad();
    });
};

/**
 * 📦 Precargar todas las imágenes
 */
export const preloadProductImages = async (products, onProgress = null) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log('📦 INICIANDO PRECARGA DE IMÁGENES');
    console.log(`${'='.repeat(60)}`);

    const startTime = Date.now();
    const imageMap = {};
    const uniqueUrls = [...new Set(products.map(p => p.image).filter(Boolean))];

    console.log(`📊 Total de imágenes únicas a cargar: ${uniqueUrls.length}`);

    for (let i = 0; i < uniqueUrls.length; i++) {
        const url = uniqueUrls[i];
        console.log(`\n[${i + 1}/${uniqueUrls.length}] Cargando: ${url}`);

        const imageData = await loadImageAsBase64(url);
        imageMap[url] = imageData;

        if (onProgress) {
            onProgress({
                current: i + 1,
                total: uniqueUrls.length,
                percentage: Math.round(((i + 1) / uniqueUrls.length) * 100),
                currentUrl: url,
                success: imageData.success
            });
        }
    }

    const endTime = Date.now();
    const successful = Object.values(imageMap).filter(d => d.success).length;
    const failed = uniqueUrls.length - successful;

    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ PRECARGA COMPLETADA');
    console.log(`${'='.repeat(60)}`);
    console.log(`⏱️ Tiempo total: ${endTime - startTime}ms`);
    console.log(`✅ Exitosas: ${successful}/${uniqueUrls.length}`);
    console.log(`❌ Fallidas: ${failed}/${uniqueUrls.length}`);
    console.log(`${'='.repeat(60)}\n`);

    return imageMap;
};

/**
 * 🖼️ Insertar imagen en PDF
 */
export const insertImageInPDF = (doc, imageData, x, y, width, height) => {
    try {
        if (imageData?.success && imageData?.base64 && imageData.base64.startsWith('data:image')) {
            doc.addImage(imageData.base64, 'JPEG', x, y, width, height);
            return true;
        } else {
            throw new Error('Imagen no válida o no cargada');
        }
    } catch (e) {
        console.warn(`⚠️ Error al insertar imagen en PDF: ${e.message}`);
        const placeholder = createPlaceholderImage('SIN IMG', 100, 100);
        doc.addImage(placeholder, 'PNG', x, y, width, height);
        return false;
    }
};

export default {
    createPlaceholderImage,
    getAbsoluteImageUrl,
    loadImageAsBase64,
    preloadProductImages,
    insertImageInPDF
};