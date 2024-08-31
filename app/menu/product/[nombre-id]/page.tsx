"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation'; // Importa el hook de parámetros de Next.js
import './product.css';

interface ProductItem {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  photo: string;
  price: number;
  rating: number;
  recommended: boolean;
  category: string;
}

function Product() {
  const { 'nombre-id': param } = useParams(); // Obtiene el parámetro de la URL
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const descriptionRef = useRef<HTMLDivElement | null>(null);

  const handleToggleDescription = () => {
    setIsExpanded(prev => !prev);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = param.split('-').pop(); // Extrae el ID del producto de la URL
        const response = await fetch(`/api/item/${productId}`); // Realiza la solicitud a la API
        const data = await response.json();

        if (data.error) {
          console.error('Error fetching product:', data.error);
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [param]);

  useEffect(() => {
    if (descriptionRef.current) {
      const { scrollHeight } = descriptionRef.current;
      setDescriptionHeight(isExpanded ? scrollHeight + 8 : 0);
    }
  }, [isExpanded]);

  const roundedRating = (rating: number): number => {
    // Redondeo personalizado basado en el decimal
    return Math.floor(rating + 0.5); // Redondea hacia arriba si el decimal es >= .5
  };

  if (isLoading) {
    return <div className="masterContainer container">
      <div className="loader"></div>
      Cargando producto...
    </div>;
  }

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className='masterContainer container'>
      <a className="back-btn" href='/menu'>
        <img src="/media/arrow.svg" alt="" />
      </a>
      <h1 className='headH1'>{product.title}</h1>
      <div className="product">
        <img src={product.photo} className='productImg' alt={product.title} />
        <div className="content">
          <div className="row1">
            <h1 className='foodTitle'>{product.title}</h1>
            <p className="foodPrice">${product.price}</p>
          </div>
          <div className="row2">
            <div className="subRow1">
              <div className="review">
                {[...Array(5)].map((_, i) => (
                  <img 
                    key={i} 
                    src={i < roundedRating(product.rating) ? "/media/filledStar.svg" : "/media/star.svg"} 
                    className='star' 
                    alt='rating star'
                  />
                ))}
              </div>
              <div className="showInfo-btn" onClick={handleToggleDescription}>
                <p>{isExpanded ? "Ocultar información" : "Mostrar información"}</p>
                <div>
                  <img 
                    src="/media/arrow.svg" 
                    alt="" 
                    style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-180deg)', transition: 'transform 0.5s ease' }} 
                  />
                </div>
              </div>
            </div>
            <div className="subRow2" style={{ height: descriptionHeight, transition: 'height 0.5s ease' }}>
              <div className="subRow2Container" ref={descriptionRef}>
                <p className='foodInfo'>
                  <strong>Descripción:</strong><br/>{product.description}
                </p>
                <p className='foodInfo'>
                  <strong>Ingredinetes:</strong><br/>{product.ingredients}
                </p>
              </div>
            </div>
          </div>
          <div className="row3">
            <label htmlFor="orderNotes">Agregar notas</label>
            <textarea className="orderNotes" name="orderNotes" id="orderNotes" placeholder=""></textarea>
          </div>
          <div className="row4">
            <div className="addToCart-btn">
              <p>Agregar al carrito</p>
              <img src="/media/cart.svg" alt="" className="cartIcon"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;