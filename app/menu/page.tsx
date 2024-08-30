"use client";

import React, { useState, useEffect, useRef } from 'react';
import './menu.css';

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
// Aca cargaria los datos de la db
const menuItems: MenuItem[] = [
  {
    title: 'Ejemplo 1',
    description: 'Descripción del ejemplo 1',
    photo: '/media/milanesa.webp',
    price: '00,000',
    rating: 3,
    recomendado: true,
    category: 'Milanesas'
  },
  {
    title: 'Ejemplo 2',
    description: 'Descripción del ejemplo 2',
    photo: '/media/milanesa.webp',
    price: '00,000',
    rating: 5,
    recomendado: false,
    category: 'Carnes'
  },
  {
    title: 'Ejemplo 3',
    description: 'Descripción del ejemplo 3',
    photo: '/media/milanesa.webp',
    price: '00,000',
    rating: 3,
    recomendado: false,
    category: 'Pollos'
  },
  {
    title: 'Ejemplo 4',
    description: 'Descripción del ejemplo 4',
    photo: '/media/milanesa.webp',
    price: '00,000',
    rating: 5,
    recomendado: false,
    category: 'Ensaladas'
  }
];

function Menu() {

  const recomendedItems = menuItems.filter(item => item.rating > 4 || item.recomendado); // Filtra los items recomendados, ya sea por su rating de 5 o su id rating

  const categories = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  //Para el btn de scroll
  const menuRef = useRef<HTMLDivElement>(null);
  const [isRotated, setIsRotated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (menuRef.current) {
        const scrollTop = menuRef.current.scrollTop;
        const maxScrollTop = menuRef.current.scrollHeight - menuRef.current.clientHeight;
        const scrollPercentage = (scrollTop / maxScrollTop) * 100;

        setIsRotated(scrollPercentage > 75);
      }
    };
    if (menuRef.current) {
      menuRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (menuRef.current) {
        menuRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  const handleButtonClick = () => {
    if (menuRef.current) {
      if (isRotated) {
        menuRef.current.scrollBy({
          top: -999,
          behavior: 'smooth',
        });
      } else {
        menuRef.current.scrollBy({
          top: 150,
          behavior: 'smooth',
        });
      }
    }
  };
  //aca termina lo del btn scroll

  return (
    <div className='menuContainer'>
      <div className="header">{restaurantName}</div>
      <div className="content">
        <div className="section">
          <h1 className="title">Productos recomendados</h1>
          <div className="items">
            {recomendedItems.map((item, index) => (
              <div key={index} className="item" style={{ backgroundImage: `url(${item.photo})` }}>
                <h1 className="foodTitle">{item.title}</h1>
                <p>${item.price}</p>
                <div className="shadow-bottom"></div>
              </div>
            ))}
          </div>
        </div>
        {Object.keys(categories).map((categoryName, index) => (
          <div key={index} className="section">
            <h1 className="title">{categoryName}</h1>
            <div className="items">
              {categories[categoryName].map((item, itemIndex) => (
                <div key={itemIndex} className="item" style={{ backgroundImage: `url(${item.photo})` }}>
                  <h1 className="foodTitle">{item.title}</h1>
                  <p>${item.price}</p>
                  <div className="shadow-bottom"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={`scroll-btn ${isRotated ? 'rotated' : ''}`} onClick={handleButtonClick}>
        <img src="/media/arrow.svg"/>
      </div>
    </div>
  );
}

export default Menu;
