"use client"
import React, { useEffect, useRef, useState } from 'react';
import { getOrders } from '@/actions/order';
import "./orders.css";

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
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const userOrders = await getOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
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

  if (isLoading) {
    return (
      <main>
        <div className='container'>Cargando ordenes...</div>
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
                <div className="textRow">
                  <p>Mesa N°</p>
                  <p>{order.tableNumber}</p>
                </div>
                <div className="textRow">
                  <p>Orden</p>
                  <p>#{order.orderId}</p>
                </div>
              </div>
              <div className="orderNotes">
                <p>Notas:</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quam in dolor assumenda nam veritatis. Eligendi id rerum tempore? Quae provident hic qui quis porro doloribus officiis optio autem quos!</p>
              </div>
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
                        <p>${(item.quantity * order.totalAmount / order.items.reduce((acc, curr) => acc + curr.quantity, 0)).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="orderState">
                <p>Estado:</p>
                <p>En preparación</p>
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
            orders.map((_, index) => (
              <div
                key={index}
                className={`orderCount ${index === currentOrderIndex ? 'orderCountSelected' : ''}`}
              />
            ))
          ) : (
            // Display arrows for more than 5 orders
            <>
              <div 
                className="arrow" 
                onClick={() => scrollToOrder('left')}
                style={{ visibility: currentOrderIndex === 0 ? 'hidden' : 'visible' }}
              >
                <img src="/media/smallArrowIcon.svg" alt="smallArrowIconLeft" />
              </div>
              <div 
                className="arrow" 
                onClick={() => scrollToOrder('right')}
                style={{ 
                  visibility: currentOrderIndex === orders.length - 1 ? 'hidden' : 'visible',
                  transform: 'scaleX(-1)' 
                }}
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