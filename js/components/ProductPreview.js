/**
 * 🖼️ COMPONENTE PRODUCT PREVIEW - Vista previa de productos
 * Componente reutilizable para mostrar vistas previas de productos
 */

import { IMAGES_DB } from '../../config/constants.js';

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

export default ProductPreview;