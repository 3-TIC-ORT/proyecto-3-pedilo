"use client";
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import navigation hook
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

interface MenuClientProps {
  menuItems: MenuItem[];
}

function MenuClient({ menuItems }: MenuClientProps) {
  const recomendedItems = menuItems.filter(item => item.rating > 4 || item.recommended);

  const categories = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Scroll handling
  const menuRef = useRef<HTMLDivElement>(null);
  const [isRotated, setIsRotated] = useState(false);

  useEffect(() => {
    if (menuRef.current) {
      const handleScroll = () => {
        const scrollTop = menuRef.current!.scrollTop;
        const maxScrollTop = menuRef.current!.scrollHeight - menuRef.current!.clientHeight;
        const scrollPercentage = (scrollTop / maxScrollTop) * 100;

        setIsRotated(scrollPercentage > 75);
      };

      menuRef.current.addEventListener('scroll', handleScroll);

      return () => {
        menuRef.current?.removeEventListener('scroll', handleScroll);
      };
    }
  }, [menuRef.current]);

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

  const router = useRouter(); // Navigation hook

  const handleProductClick = (item: MenuItem) => {
    const productUrl = `/menu/product/${item.title}-${item.id}`;
    router.push(productUrl); // Navigate to product page
  };

  return (
    <>
      <div className="menu" ref={menuRef}>
        <div className="section">
          <h1 className="title">Productos recomendados</h1>
          <div className="items">
            {recomendedItems.map((item, index) => (
              <div
                key={index}
                className="item"
                style={{ backgroundImage: `url(${item.photo})` }}
                onClick={() => handleProductClick(item)}
              >
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
                <div
                  key={itemIndex}
                  className="item"
                  style={{ backgroundImage: `url(${item.photo})` }}
                  onClick={() => handleProductClick(item)}
                >
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
        <img src="/media/arrow.svg" />
      </div>
    </>
  );
}

export default MenuClient;

