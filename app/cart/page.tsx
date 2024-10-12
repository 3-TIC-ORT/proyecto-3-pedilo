"use client"
import React, { useEffect, useRef, useState } from 'react';
import { getCart, addToCart, removeFromCart, clearCart } from '@/actions/cart';
import "./cart.css";

interface CartItem {
  itemId: number;
  title: string;
  amount: number;
  total: string;
  price: string;
}

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carga
  const itemNameRefs = useRef<HTMLParagraphElement[]>([]);
  const itemPriceRefs = useRef<HTMLParagraphElement[]>([]);

  const setItemNameRef = (el: HTMLParagraphElement | null) => {
    if (el && !itemNameRefs.current.includes(el)) {
      itemNameRefs.current.push(el);
    }
  };

  const setItemPriceRef = (el: HTMLParagraphElement | null) => {
    if (el && !itemPriceRefs.current.includes(el)) {
      itemPriceRefs.current.push(el);
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true); // Iniciar carga
        const { items } = await getCart();
        setCartItems(items);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    itemNameRefs.current.forEach((itemName, index) => {
      const itemPrice = itemPriceRefs.current[index];
      if (itemName && itemPrice) {
        const parentWidth = itemName.parentElement?.offsetWidth || 0;
        const itemPriceWidth = itemPrice.offsetWidth;
        itemName.style.maxWidth = `calc(${parentWidth}px - ${itemPriceWidth}px - 1rem)`;
      }
    });
  }, [cartItems]);

  const handleQuantityChange = async (itemId: number, delta: number) => {
    try {
      if (delta > 0) {
        await addToCart(itemId);
      } else {
        await removeFromCart(itemId);
      }
      const { items } = await getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      const { items } = await getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const handleOrder = () => {
    console.log({
      items: cartItems,
      notes: orderNotes,
    });
  };

  return (
    <main>
      {loading ? (
          <div className='container'>Cargando carrito...</div>
        ) : cartItems.length === 0 ? (
          <div className='container'>El carrito está vacío</div>
        ) : (
          <>
            <div className="headerInfo">
              <div className="textRow">
                <p>Mesa N°</p>
                <p>99</p>
              </div>
              <div className="textRow">
                <p>Total:</p>
                <p>${cartItems.reduce((total, item) => total + parseFloat(item.total.replace('$', '')), 0).toFixed(2)}</p>
              </div>
            </div>
            <div className="cartItems">
              {cartItems.map((item, index) => (
                  <div key={item.itemId} className="item">
                    <div className="dataRow">
                      <p ref={setItemNameRef} className='itemName'>{item.title}</p>
                      <p ref={setItemPriceRef} className='itemPrice'>{item.total}</p>
                    </div>
                    <div className="btns">
                      <div className="quantitySelector">
                        <div className="quantityBtns">
                          <button onClick={() => handleQuantityChange(item.itemId, -1)}>
                            <img src="/media/minusIcon.svg" alt="minusIcon" />
                          </button>
                          <p>{item.amount}</p>
                          <button onClick={() => handleQuantityChange(item.itemId, 1)}>
                            <img src="/media/plusIcon.svg" alt="plusIcon" />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveItem(item.itemId)}>
                        <img src="/media/trashcanIcon.svg" alt="trashcanIcon" />
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="orderNotes">
              <p>Notas para la cocina:</p>
              <textarea
                placeholder='Ejemplo: hamburguesa sin lechuga, papas frita...'
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              ></textarea>
            </div>
            <div className="orderBtn">
              <button onClick={handleOrder}>Ordenar</button>
            </div>
          </>
        )}
    </main>
  );
}

export default Cart;