import React from 'react';
import './menu.css';

interface MenuItem {
  title: string;
  description: string;
  photo: string;
  price: string;
  rating: number;
  recomendado: boolean;
  category: string;
}

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
  const restaurantName = 'Ejemplo';

  const recomendedItems = menuItems.filter(item => item.rating > 4 || item.recomendado);

  const categories = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

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
      <div className="help">Necesitas ayuda?</div>
    </div>
  );
}

export default Menu;