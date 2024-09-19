"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import navigation hook
import './product.css';

interface ProductItem {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  photo: string | null;
  price: number;
  rating: number;
  recommended: boolean;
  category: string;
}
interface ProductClientProps {
  product: ProductItem | null;
}

function ProductClient({ product }: ProductClientProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter(); // Navigation hook

  const handleToggleDescription = () => {
    setIsExpanded(prev => !prev);
  };

  useEffect(() => {
    if (descriptionRef.current) {
      const { scrollHeight } = descriptionRef.current;
      setDescriptionHeight(isExpanded ? scrollHeight + 8 : 0);
    }
  }, [isExpanded]);

  const roundedRating = (rating: number): number => {
    return Math.floor(rating + 0.5); // Custom rounding based on decimal
  };

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
        {product.photo ? (
          <img src={product.photo} className='productImg' alt={product.title} />
        ) : (
          <img src='/default-photo.png' className='productImg' alt={product.title} /> // Placeholder image
        )}
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
                  <strong>Descripción:</strong><br />{product.description}
                </p>
                <p className='foodInfo'>
                  <strong>Ingredientes:</strong><br />{product.ingredients}
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
              <img src="public/media/cart.svg" alt="" className="cartIcon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductClient;

