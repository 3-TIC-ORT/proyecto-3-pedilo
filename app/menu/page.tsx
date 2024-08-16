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
let menuItems: MenuItem[];
const fetchAll = async()=>{
  let response =await fetch("https://localhost:3000/api/items")
  let data = await response.json();

  for (let i = 0; i < data.length; i++) {
    menuItems.push({
      category:data[i].category,
      description: data[i].description,
      photo:data[i].photo,
      price:data[i].price,
      rating:data[i].rating,
      recomendado:data[i].recomendado,
      title:data[i].title,
    })
      
    console.log(menuItems)
    
  }
}

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