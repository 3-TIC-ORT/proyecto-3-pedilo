"use client"
import React, { useEffect, useRef, useState } from 'react';
import { getCart, addToCart, removeFromCart, clearCart } from '@/actions/cart';
import { createOrder } from '@/actions/order';
import { getUserTables } from '@/actions/tables';
import { usePopup } from '@/context/PopupContext';
import { Realtime } from 'ably';
import { useRouter } from 'next/navigation';
import "./cart.css";
import { auth } from '@/auth';

interface CartItem {
  itemId: number;
  title: string;
  amount: number;
  total: string;
  price: string;
}

function CartClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carga
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para mostrar confirmación
  const itemNameRefs = useRef<HTMLParagraphElement[]>([]);
  const itemPriceRefs = useRef<HTMLParagraphElement[]>([]);
  const [isOrderBtnDisabled, setIsOrderBtnDisabled] = useState(false);
  const [isConfirmOrderBtnDisabled, setIsConfirmOrderBtnDisabled] = useState(false);
  const [tableNumber, setTableNumber] = useState<number | null>(); // Estado para el número de mesa
  const { addPopup } = usePopup();
  const router = useRouter();

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
    const fetchTableNumber = async () => {
      try {
        const tables = await getUserTables();
        if (tables.length > 0) {
          setTableNumber(tables[0].tableNumber); // Asigna el primer número de mesa encontrado
        } else {
          setTableNumber(null)
          addPopup("Primero debes seleccionar una mesa.", true)
          setTimeout(() => {
            router.push("/tables");
          }, 1500);
        }
        //si la mesa esta null, a /tables
      } catch (error) {
        console.error('Failed to fetch table number:', error);
        addPopup('Ocurrio un error al cargar la informacion de la mesa.', true);
      }
    };

    fetchTableNumber();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true); // Iniciar carga
        const { items } = await getCart();
        setCartItems(items);

      } catch (error) {
        console.error('Failed to fetch cart items:', error);
        addPopup('Ocurrio un error al cargar la informacion del carrito.', true);
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

    channel.subscribe('cart-cleared', async (message) => {
      setTimeout(() => {
        router.push('/orders');
      }, 3000);
      addPopup('Otro usuario ha hecho el pedido. Te estaremos redirigiendo a tus ordenes.', false);
      setCartItems([]);
      setOrderNotes('');
      setShowConfirmation(false);

    });
    // Clean up on unmount
    return () => {
      channel.unsubscribe();
      ably.close();
    };
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
      if (tableNumber === null) {
        addPopup('Primero debes seleccionar una mesa', true);
        router.push('/tables');
        return; // Exit the function if tableNumber is null
      }

      if (delta > 0) {
        await addToCart(itemId, 1, tableNumber); // Pass tableNumber and itemId
      } else {
        await removeFromCart(itemId, 1, tableNumber); // Pass tableNumber and itemId
      }
      const { items } = await getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      const item = cartItems.find(item => item.itemId === itemId);
      if (item) {
        if (tableNumber === null) {
          addPopup('Primero debes seleccionar una mesa', true);
          router.push('/tables');
          return; // Exit the function if tableNumber is null
        }
        const quantity = item.amount;
        await removeFromCart(itemId, quantity, tableNumber); // Pasar la cantidad total del artículo
        const { items } = await getCart();
        setCartItems(items);
        addPopup('Artículo eliminado del carrito', false);
      } else {
        throw new Error('Item not found in cart');
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      addPopup('Ocurrio un error al eliminar el articulo del carrito.', true);
    }
  };

  const handleOrder = () => {
    if (tableNumber === null) {
      setTimeout(() => {
        router.push('/tables');
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
      if (!tableNumber) {
        addPopup('Primero debes seleccionar una mesa', true);
        router.push('/tables');
        return;
      }
      const result = await createOrder(tableNumber, orderNotes); // Pasar orderNotes a createOrder
      if (result.orderId) {
        setCartItems([]);
        setOrderNotes('');
        setShowConfirmation(false);
        setTimeout(() => {
          router.push('/orders');
        }, 3000);
        addPopup('Orden creada exitosamente. Te estaremos redirigiendo a tus ordenes.', false);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      addPopup('Ocurrio un error al confirmar la orden.', true);
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
    <main className='cartMain'>
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
              <div className="cartOrder-ClearBtns">
                <div className="orderBtn">
                  <button onClick={handleOrder} disabled={isOrderBtnDisabled}>Ordenar</button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}

export default CartClient;
