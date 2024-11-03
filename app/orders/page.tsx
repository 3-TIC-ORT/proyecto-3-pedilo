"use client";
import React, { useEffect, useRef, useState } from 'react';
import { getOrders, getAllOrders, changeOrderStatus } from '@/actions/order';
import { getSession } from 'next-auth/react';
import * as Ably from 'ably';
import "./orders.css";

interface OrderItem {
  itemId: number;
  title: string;
  quantity: number;
  status: string;
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const session = await getSession();
      setUserRole(session?.user?.role || null);

      let userOrders: Order[];
      if (session?.user?.role === 'waiter' || session?.user?.role === 'chef' || session?.user?.role === 'admin') {
        userOrders = await getAllOrders();
      } else {
        userOrders = await getOrders();
      }
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let ably: Ably.Realtime | null = null;
    let orderChannel: Ably.RealtimeChannel | null = null;
    let itemChannel: Ably.RealtimeChannel | null = null;

    const setupAbly = async () => {
      try {
        ably = new Ably.Realtime({
          key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
          clientId: userRole || 'anonymous',
        });

        orderChannel = ably.channels.get('orders');
        itemChannel = ably.channels.get('orderItems');

        orderChannel.subscribe('order-created', (message) => {
          const newOrder = message.data as Order;
          setOrders((prevOrders) => [...prevOrders, newOrder]);
        });

        orderChannel.subscribe('order-status-update', (message) => {
          console.log('Order status update:', message.data);
          const update = message.data as { orderId: number; status: string };
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.orderId === update.orderId
                ? { ...order, status: update.status }
                : order
            )
          );
        });

        itemChannel.subscribe('item-status-update', (message) => {
          const update = message.data as { orderId: number; itemId: number; status: string };
          setOrders((prevOrders) =>
            prevOrders.map((order) => {
              if (order.orderId === update.orderId) {
                return {
                  ...order,
                  items: order.items.map((item) =>
                    item.itemId === update.itemId
                      ? { ...item, status: update.status }
                      : item
                  ),
                };
              }
              return order;
            })
          );
        });
      } catch (error) {
        console.error('Error setting up Ably:', error);
        setError('Failed to connect to real-time updates.');
      }
    };

    setupAbly();

    return () => {
      orderChannel?.unsubscribe();
      itemChannel?.unsubscribe();
      ably?.close();
    };
  }, [userRole]);

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
      const newScrollPosition = containerRef.current.scrollLeft + (direction === 'left' ? -orderWidth : orderWidth);
      containerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleOrderReady = async (orderId: number) => {
    try {
      await changeOrderStatus(orderId, 'ready');
      // State will be updated by the real-time subscription
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <main>
        <div className='container'>Cargando ordenes...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className='container'>{error}</div>
      </main>
    );
  }

  if (userRole === 'waiter' || userRole === 'chef' || userRole === 'admin') {
    const sortedOrders = [...orders].sort((a, b) => a.status === 'ready' ? 1 : -1);

    return (
      <main>
        <h1>Ordenes</h1>
        <div className="waiterOrders">
          {sortedOrders.map((order) => (
            <section key={order.orderId} className={`waiterSection ${order.status === 'ready' ? 'ready' : ''}`}>
              <div className="textRow">
                <p>Mesa N°</p>
                <p>{order.tableNumber}</p>
                <p>-</p>
                <p>Orden #{order.orderId}</p>
              </div>
              {order.orderNote && (
                <div className="orderNotes">
                  <p>Notas:</p>
                  <p>{order.orderNote}</p>
                </div>
              )}
              <div className="itemsContainer">
                {order.items.map((item) => (
                  <div key={item.itemId} className="itemRow">
                    <p>{item.title}</p>
                    <p>{item.quantity}x</p>
                    <p className="itemStatus">{item.status}</p>
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
      <main>
        <div className='container'>No tienes ordenes.</div>
      </main>
    );
  }

  return (
    <main>
      <h1>Tus ordenes</h1>
      <div className="orders">
        <div
          className="ordersContainer"
          ref={containerRef}
          onScroll={handleScroll}
        >
          {orders.map((order, index) => (
            <section key={order.orderId}>
              <div className="textRow">
                <p>Mesa N°</p>
                <p>{order.tableNumber}</p>
                <p>-</p>
                <p>Orden #{order.orderId}</p>
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
                        <p className="itemStatus">{item.status}</p>
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
          {orders.length} ordenes
        </div>
      </div>
    </main>
  );
};

export default Orders;

