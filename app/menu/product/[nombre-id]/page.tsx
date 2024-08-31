"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './product.css';

interface MenuItem {
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

async function fetchProductData(id: string): Promise<MenuItem | null> {
  try {
    const response = await fetch(`/api/items/${id}`);
    if (!response.ok) throw new Error('Product not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

function ProductDetail() {
  const [product, setProduct] = useState<MenuItem | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const descriptionRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('nombre-id')?.split('-').pop(); // Obtener ID de la URL
  
  useEffect(() => {
    if (productId) {
      fetchProductData(productId).then(setProduct);
    }
  }, [productId]);

  const handleToggleDescription = () => {
    setIsExpanded(prev => !prev);
  };

  useEffect(() => {
    if (descriptionRef.current) {
      const { scrollHeight } = descriptionRef.current;
      setDescriptionHeight(isExpanded ? scrollHeight + 16 : 0);
    }
  }, [isExpanded]);

  if (!product) {
    return <div>Cargando producto...</div>;
  }

  return (
    <div className='masterContainer container'>
      <a className="back-btn" onClick={() => router.push('/menu')}>
        <img src="/media/arrow.svg" alt="" />
      </a>
      <h1 className='headH1'>{product.title}</h1>
      <div className="product">
        <img src={product.photo} className='productImg' />
        <div className="content">
          <div className="row1">
            <h1 className='foodTitle'>{product.title}</h1>
            <p className="foodPrice">${product.price}</p>
          </div>
          <div className="row2">
            <div className="subRow1">
              <div className="review">
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={i < product.rating ? "/media/filledStar.svg" : "/media/star.svg"} className='star' />
                ))}
              </div>
              <div className="showDescription-btn" onClick={handleToggleDescription}>
                <p>Mostrar Descipcion</p>
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
                <p className='foodDescription'>
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
