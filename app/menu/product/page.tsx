"use client";
import React, { useState, useRef, useEffect } from 'react';
import './product.css';

function Product() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const descriptionRef = useRef(null);

  const handleToggleDescription = () => {
    setIsExpanded(prev => !prev);
  };

  useEffect(() => {
    if (descriptionRef.current) {
      const { scrollHeight } = descriptionRef.current;
      setDescriptionHeight(isExpanded ? scrollHeight + 16 : 0);
    }
  }, [isExpanded]);

  return (
    <div className='masterContainer container'>
      <a className="back-btn" href='/menu'>
        <img src="/media/arrow.svg" alt="" />
      </a>
      <h1 className='headH1'>Product Name</h1>
      <div className="product">
        <img src="/media/milanesa.webp" className='productImg' />
        <div className="content">
          <div className="row1">
            <h1 className='foodTitle'>Product Name</h1>
            <p className="foodPrice">$00.000</p>
          </div>
          <div className="row2">
            <div className="subRow1">
              <div className="review">
                <img src="/media/filledStar.svg" className='star' />
                <img src="/media/filledStar.svg" className='star' />
                <img src="/media/filledStar.svg" className='star' />
                <img src="/media/star.svg" className='star' />
                <img src="/media/star.svg" className='star' />
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
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                  Officia id quod blanditiis minima, mollitia aspernatur fugit! 
                  Sed, aperiam sint voluptatum error nostrum tenetur debitis maxime sapiente atque consequatur repellendus numquam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;