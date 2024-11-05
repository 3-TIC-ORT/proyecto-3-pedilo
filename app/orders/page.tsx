"use client"
import React, { useEffect, useRef, useState } from 'react';
import { getOrders, getAllOrders, changeOrderStatus } from '@/actions/order';
import { getSession } from 'next-auth/react'; // Actualiza la importación de getSession
import "./orders.css";
import { Realtime } from 'ably';

interface OrderItem {
  itemId: number;
  title: string;
  quantity: number;
}

interface Order {
  orderId: number;
  totalAmount: number;
  orderDate: Date;
  tableNumber: number | null;
  items: OrderItem[];
  status: string;
  orderNote: string | null;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null); // Estado para almacenar el rol del usuario
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const session = await getSession();
        setUserRole(session?.user?.role || null); // Establece el rol del usuario

        let userOrders;
        if (session?.user?.role === 'waiter' || session?.user?.role === 'chef' || session?.user?.role === 'admin') {
          userOrders = await getAllOrders();
        } else {
          userOrders = await getOrders();
        }
        if (!Array.isArray(userOrders)) {
          throw new Error('Invalid orders data received');
        }
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar las ordenes');
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
    
    const ably = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });
    const channel = ably.channels.get('order-updates');

    channel.subscribe('order-created', async (message) => {
      // Verificar que el mensaje tenga datos
      if (!message.data) {
        console.error('Received empty message data');
        return;
      }
      const newOrder = message.data;
      
      try {
        const session = await getSession();
        const userRole = session?.user?.role;
        
        if (userRole === 'waiter' || userRole === 'chef' || userRole === 'admin') {
          setOrders(prevOrders => {
            if (!prevOrders) return [newOrder];
            
            // Evitar duplicados
            const orderExists = prevOrders.some(order => order.orderId === newOrder.orderId);
            if (orderExists) return prevOrders;
            
            const updatedOrders = [...prevOrders, newOrder];
            return updatedOrders.sort((a, b) => {
              if (a.status === 'ready' && b.status !== 'ready') return 1;
              if (a.status !== 'ready' && b.status === 'ready') return -1;
              return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
            });
          });
        } else if (session?.user?.id) {
          const userOrders = await getOrders(session.user.id);
          if (userOrders.some(order => order.orderId === newOrder.orderId)) {
            setOrders(prevOrders => {
              if (!prevOrders) return [newOrder];
              
              const orderExists = prevOrders.some(order => order.orderId === newOrder.orderId);
              if (orderExists) return prevOrders;
              
              const updatedOrders = [...prevOrders, newOrder];
              return updatedOrders.sort((a, b) => {
                if (a.status === 'ready' && b.status !== 'ready') return 1;
                if (a.status !== 'ready' && b.status === 'ready') return -1;
                return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
              });
            });
          }
        }
      } catch (error) {
        console.error('Error processing new order:', error);
      }
    });

    channel.subscribe('order-status-change', async (message) => {
      if (!message.data) {
        console.error('Received empty status change data');
        return;
      }

      const { orderId, status, items } = message.data;
      
      if (!orderId || !status) {
        console.error('Invalid status change data received');
        return;
      }

      setOrders(prevOrders => {
        if (!prevOrders) return [];
        
        return prevOrders.map(order => {
          if (order.orderId === orderId) {
            return {
              ...order,
              status,
              items: items || order.items
            };
          }
          return order;
        }).sort((a, b) => {
          if (a.status === 'ready' && b.status !== 'ready') return 1;
          if (a.status !== 'ready' && b.status === 'ready') return -1;
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        });
      });
    });

    return () => {
      channel.unsubscribe();
      ably.close();
    };
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollPosition = containerRef.current.scrollLeft;
      const orderWidth = containerRef.current.clientWidth;
      const newIndex = Math.round(scrollPosition / orderWidth);
      setCurrentOrderIndex(newIndex);
    }
  };

  const scrollToOrder = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const orderWidth = containerRef.current.clientWidth;
      const newScrollPosition = containerRef.current.scrollLeft +
        (direction === 'left' ? -orderWidth : orderWidth);

      containerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOrderReady = async (orderId: number) => {
    try {
      await changeOrderStatus(orderId, 'ready');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: 'ready' } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (isLoading) {
    return (
      <main className='ordersMain'>
        <div className='container'>Cargando ordenes...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='ordersMain'>
        <div className='container'>
          <p>Error: {error}</p>
        </div>
      </main>
    );
  }

  if (userRole === 'waiter' || userRole === 'chef' || userRole === 'admin') { // Verifica si el usuario tiene acceso a la sección
    // Ordenar las órdenes para que las que están en estado "ready" aparezcan al final
    let sortedOrders = [...orders].sort((a, b) => {
      if (a.status === 'ready' && b.status !== 'ready') return 1;
      if (a.status !== 'ready' && b.status === 'ready') return -1;
      
      if (a.status === 'ready' && b.status === 'ready') {
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      }
      
      return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
    });

    return (
      <main className='ordersMain'>
        <h1>Ordenes</h1>
        <div className="waiterOrders">
          {sortedOrders.map((order) => (
            <section key={order.orderId} className={`waiterSection ${order.status === 'ready' ? 'ready' : ''}`}>
              <div className="textRow">
                <div className="textRow">
                  <p>Mesa N°</p>
                  <p>{order.tableNumber}</p>
                </div>
                <p>-</p>
                <div className="textRow">
                  <p>Orden</p>
                  <p>#{order.orderId}</p>
                </div>
              </div>
              {order.orderNote && (
                <div className="orderNotes">
                  <p>Notas:</p>
                  <p>{order.orderNote}</p>
                </div>
              )}
              <div className="itemsContainer">
                {order.items && order.items.map((item) => ( //{order.items.map((item) => (
                  <div key={item.itemId} className="itemRow">
                    <p>{item.title}</p>
                    <p>{item.quantity}x</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleOrderReady(order.orderId)}
                disabled={order.status === 'ready'}
              >
                Listo
              </button>
            </section>
          ))}
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className='ordersMain'>
        <div className='container'>No tienes ordenes.</div>
      </main>
    );
  }

  let sortedClientOrders = [...orders].sort((a, b) => {
    if (a.status === 'ready' && b.status !== 'ready') return 1;
    if (a.status !== 'ready' && b.status === 'ready') return -1;
    
    return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
  });

  return (
    <main className='ordersMain'>
      <h1>Tus ordenes</h1>
      <div className="orders">
        <div
          className="ordersContainer"
          ref={containerRef}
          onScroll={handleScroll}
        >
          {sortedClientOrders.map((order, index) => (
            <section key={order.orderId}>
              <div className="textRow">
                <div className="textRow">
                  <p>Mesa N°</p>
                  <p>{order.tableNumber}</p>
                </div>
                <div className="textRow">
                  <p>Orden</p>
                  <p>#{order.orderId}</p>
                </div>
              </div>
              {order.orderNote && (
                <div className="orderNotes">
                  <p>Notas:</p>
                  <p>{order.orderNote}</p>
                </div>
              )}
              <div className="orderItems">
                <div className="textRow">
                  <p>Productos:</p>
                  <div className="textRow">
                    <p>Total:</p>
                    <p>${order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="itemsContainer">
                  {order.items.map((item) => (
                    <div key={item.itemId} className="item">
                      <div className="itemRow">
                        <p>{item.title}</p>
                        <p>{item.quantity}x</p>
                      </div>
                      <div className="itemPrice">
                        <p>${(item.quantity * order.totalAmount / order.items.reduce((acc, curr) => acc + curr.quantity, 0)).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="orderState">
                <p>Estado:</p>
                <p>{order.status}</p>
              </div>
              <div className="orderDetails">
                {formatDate(order.orderDate)}
              </div>
            </section>
          ))}
        </div>
        <div className="ordersCounter">
          {orders.length <= 5 ? (
            // Display dots for 5 or fewer orders
            sortedClientOrders.map((_, index) => (
              <div
                key={index}
                className={`orderCount ${index === currentOrderIndex ? 'orderCountSelected' : ''}`}
              />
            ))
          ) : (
            // Display arrows for more than 5 orders
            <>
              <div
                className={`arrow ${currentOrderIndex === 0 ? 'disabled' : ''}`}
                onClick={() => scrollToOrder('left')}
              >
                <img src="/media/smallArrowIcon.svg" alt="smallArrowIconLeft" />
              </div>
              <div
                className={`arrow ${currentOrderIndex === orders.length - 1 ? 'disabled' : ''}`}
                onClick={() => scrollToOrder('right')}
                style={{ transform: 'scaleX(-1)' }}
              >
                <img src="/media/smallArrowIcon.svg" alt="smallArrowIconRight" />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Orders;
