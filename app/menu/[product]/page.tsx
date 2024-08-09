import React from 'react';
import './product.css'

function Product() {
    
    const item = {
        title: 'Ejemplo 1',
        description: 'Descripción del ejemplo 1',
        photo: '/media/milanesa.webp',
        price: '00,000',
        rating: 3,
        recomendado: true,
        category: 'Milanesas',
    }
    return (
        <div className='productMasterContainer'>
            <div className="backBtn">
                <img src="/media/arrow.svg"/>
            </div>
            <div className="productContainer">
                <div style={{ backgroundImage: `url(${item.photo})` }} className='img'></div>
                <div className="productInfo"></div>
            </div>
        </div>
    );
}

export default Product;
