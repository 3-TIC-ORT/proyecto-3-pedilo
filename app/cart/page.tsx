"use client"
import React, { useEffect, useRef, useState } from 'react';
import { getCart, addToCart, removeFromCart, clearCart } from '@/actions/cart';
import { createOrder } from '@/actions/order';
import { getUserTables } from '@/actions/tables';
import { Realtime } from 'ably';
import "./cart.css";

interface CartItem {
  itemId: number;
  title: string;
  amount: number;
  total: string;
  price: string;
}

interface Popup {
  message: string;
  count: number;
  id: number;
  exit: boolean;
}

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carga
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para mostrar confirmación
  const [popups, setPopups] = useState<Popup[]>([]); // Estado para popups
  const itemNameRefs = useRef<HTMLParagraphElement[]>([]);
  const itemPriceRefs = useRef<HTMLParagraphElement[]>([]);
  const [isOrderBtnDisabled, setIsOrderBtnDisabled] = useState(false);
  const [isConfirmOrderBtnDisabled, setIsConfirmOrderBtnDisabled] = useState(false);
  const [tableNumber, setTableNumber] = useState<number | null>(null); // Estado para el número de mesa

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
        addPopup('Ocurrio un error al cargar el carrito. Por favor, intente nuevamente.');
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchCartItems();
    const ably = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });

    // Subscribe to the cart-updates channel
    const channel = ably.channels.get('cart-updates');
    channel.subscribe('item-updated', async (message) => {
      const { items } = await getCart();
      setCartItems(items);
    });

    // Clean up on unmount
    return () => {
      channel.unsubscribe();
      ably.close();
    };
  }, []);

  useEffect(() => {
    const fetchTableNumber = async () => {
      try {
        const tables = await getUserTables();
        if (tables.length > 0) {
          setTableNumber(tables[0].tableNumber); // Asigna el primer número de mesa encontrado
        }
      } catch (error) {
        console.error('Failed to fetch table number:', error);
        addPopup('Ocurrió un error al cargar el número de mesa. Por favor, intente nuevamente.');
      }
    };

    fetchTableNumber();
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

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    popups.forEach((popup, index) => {
      timers.push(setTimeout(() => {
        setPopups(prev => prev.map(p => p.id === popup.id ? { ...p, exit: true } : p));
        setTimeout(() => {
          setPopups(prev => prev.filter(p => p.id !== popup.id));
        }, 500); // Duration of exit animation
      }, 2500)); // Show popup for 2.5 seconds
    });
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [popups]);

  const addPopup = (message: string) => {
    setPopups(prev => {
      const existingPopup = prev.find(popup => popup.message === message);
      if (existingPopup) {
        return prev.map(popup =>
          popup.message === message
            ? { ...popup, count: popup.count + 1 }
            : popup
        );
      } else {
        return [...prev, { message, count: 1, id: Date.now(), exit: false }];
      }
    });
  };

  const handleQuantityChange = async (itemId: number, delta: number) => {
    try {
      if (tableNumber === null) {
        addPopup('Número de mesa no asignado. Por favor, seleccione una mesa.');
        return; // Exit the function if tableNumber is null
      }

      if (delta > 0) {
        await addToCart(itemId, 1, tableNumber); // Pass tableNumber and itemId
        addPopup('Cantidad aumentada');
      } else {
        await removeFromCart(itemId, 1, tableNumber); // Pass tableNumber and itemId
        addPopup('Cantidad disminuida');
      }
      const { items } = await getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      addPopup('Ocurrió un error al actualizar la cantidad. Por favor, intente nuevamente.');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      const item = cartItems.find(item => item.itemId === itemId);
      if (item) {
        await removeFromCart(itemId, item.amount); // Pasar la cantidad total del artículo
        const { items } = await getCart();
        setCartItems(items);
        addPopup('Producto eliminado');
      } else {
        addPopup('El artículo no se encontró en el carrito.');
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      addPopup('Ocurrio un error al eliminar el producto. Por favor, intente nuevamente.');
    }
  };

  const handleOrder = () => {
    if (tableNumber === null) {
      addPopup('Por favor, seleccione una mesa. Te estamos redirigiendo...');
      setTimeout(() => {
        window.location.href = '/tables';
      }, 3000);
      return;
    }

    setShowConfirmation(true); // Mostrar botón de confirmación
    setIsOrderBtnDisabled(true); // Deshabilitar botón de ordenar
    setTimeout(() => {
      setIsConfirmOrderBtnDisabled(false); // Habilitar botón de confirmar
    }, 500);
  };

  const handleConfirmOrder = async () => {
    try {
      setIsConfirmOrderBtnDisabled(true);
      const result = await createOrder(undefined, orderNotes); // Pasar orderNotes a createOrder
      if (result.orderId) {
        addPopup(`Orden creada exitosamente. Número de orden: ${result.orderId}. Te redirigiremos a tus órdenes.`);
        await clearCart();
        setCartItems([]);
        setOrderNotes('');
        setShowConfirmation(false);
        setTimeout(() => {
          window.location.href = '/orders';
        }, 3000);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      addPopup('Error al crear la orden. Por favor, intente nuevamente.');
    } finally {
      setIsConfirmOrderBtnDisabled(false);
    }
  };

  const handleBackArrowClick = () => {
    setShowConfirmation(false);
    setIsOrderBtnDisabled(false); // Deshabilitar botón de confirmar
    setIsConfirmOrderBtnDisabled(true);
  };

  return (
    <main>
      {showConfirmation ? (
        <div className="container">
          <div className='confirmationContainer'>
            <button className="backArrowBtn" onClick={handleBackArrowClick}><img src="/media/arrowIcon.svg" alt="arrowIcon" /></button>
            <h1>Una última confirmación por las dudas</h1>
            <p>Tocá confirmar pedido y preparate para comer</p>
            <div className="orderBtn">
              <button onClick={handleConfirmOrder} disabled={isConfirmOrderBtnDisabled}>
                {isConfirmOrderBtnDisabled ? 'Procesando...' : 'Confirmar Orden'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <div className='container'>Cargando carrito...</div>
          ) : cartItems.length === 0 ? (
            <div className='container'>El carrito está vacío</div>
          ) : (
            <>
              <div className="headerInfo">
                <div className="textRow">
                  <p>Mesa N°</p>
                  <p>{tableNumber !== null ? tableNumber : 'No asignada'}</p>
                </div>
                <div className="textRow">
                  <p>Total:</p>
                  <p>${cartItems.reduce((total, item) => total + parseFloat(item.total.replace('$', '')), 0).toFixed(2)}</p>
                </div>
              </div>
              <div className="cartItems">
                {cartItems.slice().reverse().map((item, index) => (
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
                ))}
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
                <button onClick={handleOrder} disabled={isOrderBtnDisabled}>Ordenar</button>
              </div>
            </>
          )}
        </>
      )}
      <div className="popups">
        {popups.map((popup, index) => (
          <div key={popup.id} className={`popup ${popup.exit ? 'popup-exit' : ''}`}>
            {popup.message} ({popup.count})
          </div>
        ))}
      </div>
    </main>
  );
}

export default Cart;
