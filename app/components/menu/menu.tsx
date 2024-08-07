import React from 'react'
import './menu.css'

function Menu() {
    const restaurantName = 'Ejemplo'
    const foodName = 'Ejemplo'
    const foodPrice = '00,000'
    const foodPhoto = '/media/milanesa.webp'

  return (
    <div className='menuContainer'>
      <div className="header">{restaurantName}</div>
      <div className="content">
        <div className="section">
            <div className="item" style={{"backgroundImage" : `url(${foodPhoto})`}}>
                <h1>{foodName}</h1>
                <p>${foodPrice}</p>
                <div className="shadow-bottom"></div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
