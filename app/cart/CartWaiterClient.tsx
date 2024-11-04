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

interface CartItem {
  itemId: number;
  title: string;
  amount: number;
  total: string;
  price: string;
}

interface CartWaiterClientProps {
  userRole: string | null;
  waiterTables: Table[];
}

function CartWaiterClient({ userRole, waiterTables }: CartWaiterClientProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carga
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para mostrar confirmación
  const itemNameRefs = useRef<HTMLParagraphElement[]>([]);
  const itemPriceRefs = useRef<HTMLParagraphElement[]>([]);
  const [isOrderBtnDisabled, setIsOrderBtnDisabled] = useState(false);
  const [isConfirmOrderBtnDisabled, setIsConfirmOrderBtnDisabled] = useState(false);
  const { addPopup } = usePopup();
  const router = useRouter();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

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
      if (!selectedTable) return;

      try {
        setLoading(true);
        const { items } = await getCart(selectedTable); // Modify getCart to accept tableNumber
        setCartItems(items);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
        addPopup('Ocurrio un error al cargar la informacion del carrito.', true);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();

    const ably = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });
    const channel = ably.channels.get('cart-updates');

    channel.subscribe('item-updated', async (message) => {
      if (message.data.tableNumber === selectedTable) {
        if (!selectedTable) return;
        const { items } = await getCart(selectedTable); // Modify getCart to accept tableNumber
        setCartItems(items);
      }
    });

    return () => {
      channel.unsubscribe();
      ably.close();
    };
  }, [selectedTable]);

  const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tableNum = parseInt(event.target.value);
    setSelectedTable(tableNum);
    setCartItems([]);
  };

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
      if (selectedTable === null) {
        addPopup('Primero debes seleccionar una mesa', true);
        return; // Exit the function if tableNumber is null
      }

      if (delta > 0) {
        await addToCart(itemId, 1, selectedTable); // Pass tableNumber and itemId
      } else {
        await removeFromCart(itemId, 1, selectedTable); // Pass tableNumber and itemId
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
        await removeFromCart(itemId, item.amount); // Pasar la cantidad total del artículo
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
    if (selectedTable === null) {
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
      if (!selectedTable) {
        addPopup('Primero debes seleccionar una mesa', true);
        router.push('/tables');
        throw new Error('Table not selected');
      }
      const result = await createOrder(selectedTable, orderNotes,); // Pasar orderNotes a createOrder
      if (result.orderId) {
        await clearCart();
        setCartItems([]);
        setOrderNotes('');
        setShowConfirmation(false);
        addPopup('Orden creada exitosamente.', false);
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
    setCartItems([]);
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
          <select name="tableNumber" id="tableNumber" value={selectedTable || "tableSelect"} onChange={handleTableChange} className='tableNumberSelect'>
            <option value="tableSelect" disabled>Seleccionar mesa</option>
            {waiterTables.map(table => (
              <option key={table.tableNumber} value={table.tableNumber}>
                Mesa {table.tableNumber}
              </option>
            ))}
          </select>
          {loading ? (
            <div className='container'>Cargando carrito...</div>
          ) : cartItems.length === 0 ? (
            <div className='container'>El carrito está vacío</div>
          ) : (
            <>
              <div className="headerInfo">
                <div className="textRow">
                  <p>Mesa N°</p>
                  <p>{selectedTable !== null ? selectedTable : 'No asignada'}</p>
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
    </main>
  );
}

export default CartWaiterClient;
