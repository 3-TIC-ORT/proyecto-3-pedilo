"use client";
import React, { useEffect, useRef, useState } from 'react';
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

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);  // Para manejar el estado de carga

  // Cargar los datos desde la API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/items');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return { menuItems, isLoading };
}

function Menu() {
  const { menuItems, isLoading } = useMenuItems();

  const recomendedItems = menuItems.filter(item => item.rating > 4 || item.recommended);

  const categories = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Para el botón de scroll
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

  if (isLoading) {
    return <div className="masterContainer container">
      <div className="loader"></div>
      Cargando menú...
      </div>;
  }
  
  return (
    <div className="masterContainer container">
      <h1 className='headH1'>Menu</h1>
      <div className="menu" ref={menuRef}>
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