"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import navigation hook
import { addToCart } from '@/actions/cart'; // Import the addToCart function
import { usePopup } from '@/context/PopupContext';
import { getUserTables } from '@/actions/tables';
import './menu.css';
import { getTables } from '@/actions/tables';

interface MenuItem {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  photo: string | null;
  price: number;
  category: string;
}

interface MenuClientProps {
  menuItems: MenuItem[];
  userRole: string | null;
  waiterTables: Table[] | null;
}

interface Table {
  tableNumber: number;
  waiterId: string;
  Cart?: {
    CartItems: Array<{
      Item: {
        id: number;
        title: string;
        price: string;
      };
      amount: number;
    }>;
  };
}

function MenuClient({ menuItems: initialMenuItems, userRole, waiterTables }: MenuClientProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [tables, setTables] = useState<Table[]>(waiterTables || []);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const router = useRouter(); // Navigation hook
  const { addPopup } = usePopup();
  const [tableNumber, setTableNumber] = useState<number | null>(null); // Estado para el número de mesa

  const categories = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  useEffect(() => {
    const fetchTableNumber = async () => {
      try {
        if (userRole === "user") {
          const tables = await getUserTables();
          setTableNumber(tables[0].tableNumber); // Asigna el primer número de mesa encontrado
        }
      } catch (error) {
        console.error('Failed to fetch table number:', error);
        addPopup('Ocurrio un error al cargar la informacion de la mesa.', true);
      }
    };

    fetchTableNumber();
  }, []);

  const handleProductClick = (item: MenuItem) => {
    const productUrl = `/menu/product/${item.title}-${item.id}`;
    router.push(productUrl); // Navigate to product page
  };

  const handleQuantityChange = (itemId: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
    }));
  };

  const handleOrder = async (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    if (quantity > 0) {
      try {
        if (userRole === "waiter") {
          if ((document.getElementById('tableNumber') as HTMLSelectElement).value === "NoTable") {
            addPopup("Primero necesitas seleccionar una mesa para poder agregar productos a la orden.")
          } else {
            await addToCart(item.id, quantity, Number((document.getElementById('tableNumber') as HTMLSelectElement).value));
            if (quantity > 1) {
              addPopup(`Se agregaron ${quantity} ${item.title} al carrito de la mesa ${Number((document.getElementById('tableNumber') as HTMLSelectElement).value)}`, false); // Puedes cambiar el mensaje y si es un error
            } else {
            addPopup(`Se agregego ${item.title} al carrito de la mesa ${Number((document.getElementById('tableNumber') as HTMLSelectElement).value)}`, false); // Puedes cambiar el mensaje y si es un error
            }
          }
        } else if (tableNumber === null){
          addPopup("Primero necesitas seleccionar una mesa.")
          router.push("/tables")
        } else {
          await addToCart(item.id, quantity);

          if (quantity > 1) {
            addPopup(`Se agregaron ${quantity} ${item.title} al carrito`, false); // Puedes cambiar el mensaje y si es un error
          } else {
          addPopup(`Se agregego ${item.title} al carrito`, false); // Puedes cambiar el mensaje y si es un error
          }
        } // Llama a la función addToCart para agregar el producto al carrito
      } catch (error) {
        console.error('Error adding item to cart:', error);
        addPopup(`Ocurrio un error al agregar ${item.title} al carrito`, true); // Puedes cambiar el mensaje y si es un error
      }
    }
  }

  return (
    <>
      {userRole === "waiter" && (
        <select name="tableNumber" id="tableNumber" className='tableNumberSelect'>
          <option value="NoTable" selected disabled>Seleccionar mesa</option>
          {tables.map(table => (
            <option key={table.tableNumber} value={table.tableNumber}>
                Mesa {table.tableNumber}
            </option>
          ))}
        </select>
      )}
      <div className="sectionsScroller">
        {Object.keys(categories).map((categoryName, index) => (
          <button
            key={index}
            className="sectionScrollerBtn"
            onClick={() => {
              document.getElementById(categoryName)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {categoryName}
          </button>
        ))}
      </div>
      <div className="products">
        {Object.keys(categories).map((categoryName, index) => (
          <section key={index} id={categoryName}>
            <h1>{categoryName}</h1>
            <div className="categoryProducts">
              {categories[categoryName].map((item, itemIndex) => (
                <div key={itemIndex} className="product" onClick={() => handleProductClick(item)}>
                  {item.photo ? (
                    <div className="productInfoContainer">
                      <p className="name">{item.title}</p>
                      <img src={item.photo} alt={item.title} className="productImg" />
                    </div>
                  ) : (
                    <div className="productTitleContainer">
                      <p className="name">{item.title}</p>
                    </div>
                  )}
                  <div className="price-tag">
                    <p className="price">${item.price.toFixed(2)}</p>
                    <p className="tag">{item.category}</p>
                  </div>
                  {(userRole === "user" || userRole === "waiter") && (
                    <div className="btns">
                      <div className="quantitySelector">
                        <p>{quantities[item.id] || 1}</p>
                        <div className="quantityBtns">
                          <button onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, -1); }}>
                            <img src="/media/minusIcon.svg" alt="minusIcon" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, 1); }}>
                            <img src="/media/plusIcon.svg" alt="plusIcon" />
                          </button>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleOrder(item); }}>
                        <svg width="1rem" height="1rem" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g id="Carrito">
                            <path id="Vector" d="M28.3333 29.9999C26.4833 29.9999 25 31.4833 25 33.3333C25 34.2173 25.3512 35.0652 25.9763 35.6903C26.6014 36.3154 27.4492 36.6666 28.3333 36.6666C29.2173 36.6666 30.0652 36.3154 30.6903 35.6903C31.3154 35.0652 31.6666 34.2173 31.6666 33.3333C31.6666 32.4492 31.3154 31.6014 30.6903 30.9762C30.0652 30.3511 29.2173 29.9999 28.3333 29.9999ZM1.66663 3.33325V6.66659H4.99996L11 19.3166L8.73329 23.3999C8.48329 23.8666 8.33329 24.4166 8.33329 24.9999C8.33329 25.884 8.68448 26.7318 9.3096 27.3569C9.93472 27.9821 10.7826 28.3333 11.6666 28.3333H31.6666V24.9999H12.3666C12.2561 24.9999 12.1501 24.956 12.072 24.8779C11.9939 24.7997 11.95 24.6938 11.95 24.5833C11.95 24.4999 11.9666 24.4333 12 24.3833L13.5 21.6666H25.9166C27.1666 21.6666 28.2666 20.9666 28.8333 19.9499L34.8 9.16659C34.9166 8.89992 35 8.61659 35 8.33325C35 7.89122 34.8244 7.4673 34.5118 7.15474C34.1992 6.84218 33.7753 6.66659 33.3333 6.66659H8.68329L7.11663 3.33325M11.6666 29.9999C9.81663 29.9999 8.33329 31.4833 8.33329 33.3333C8.33329 34.2173 8.68448 35.0652 9.3096 35.6903C9.93472 36.3154 10.7826 36.6666 11.6666 36.6666C12.5507 36.6666 13.3985 36.3154 14.0236 35.6903C14.6488 35.0652 15 34.2173 15 33.3333C15 32.4492 14.6488 31.6014 14.0236 30.9762C13.3985 30.3511 12.5507 29.9999 11.6666 29.9999Z" fill="#5883e1" />
                          </g>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export default MenuClient;
