import React from 'react';
import './product.css'

const Product = () => {
    /*
    {
    title: 'Ejemplo 1',
    description: 'Descripción del ejemplo 1',
    photo: '/media/milanesa.webp',
    price: '00,000',
    rating: 3,
    recomendado: true,
    category: 'Milanesas'
    }
    */
    return (
        <div className='productMasterContainer'>
            <div className="backBtn">
                <img src=""/>
            </div>
            <div className="productContainer">
                <img src="/media/milanesa.webp"/>
                <div className="productInfo"></div>
            </div>
        </div>
    );
}

export default Product;
