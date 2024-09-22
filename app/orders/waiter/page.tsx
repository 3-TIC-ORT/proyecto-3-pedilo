"use client";
import React, { useState, useEffect } from 'react';
import '../orders.css';

interface Order {
  id: number;
  table: string;
  items: { name: string; price: number }[];
  total: number;
  state: string;
  createdAt: string;
}

function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("waiting");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders'); // Asegúrate de que esta ruta esté correcta
        const data = await response.json();
        // Ordenar los pedidos por fecha de creación
        const sortedOrders = data.sort((a: Order, b: Order) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleRadioChange = (e, orderId) => {
    const newState = e.target.id;
    setSelectedState(newState);
    updateOrderState(orderId, newState);
  };

  const updateOrderState = async (orderId, newState) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: newState }),
      });
    } catch (error) {
      console.error('Error updating order state:', error);
    }
  };

  const handleFinalizeOrder = async (orderId) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      // Actualizar la lista de pedidos después de finalizar uno
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error finalizing order:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="masterContainer container">
        <div className="loader"></div>
        Cargando pedidos...
      </div>
    );
  }

  return (
    <div className='masterContainer container'>
      <h1 className='headH1'>Ordenes (Mozo)</h1>
      <div className="orders">
        {orders.map(order => (
          <div key={order.id} className="order">
            <div className="orderHeader">
              <div className="orderTitle">
                <h2>{order.table}</h2>-<p>Orden #{order.id}</p>
              </div>
              <div className="closeOrderBtnContainer">
                <button className="closeOrderBtn" onClick={() => handleFinalizeOrder(order.id)}>Finalizar</button>
              </div>
            </div>
            <div className="orderBody">
              <div className="orderItems">
                {order.items.map((item, index) => (
                  <div key={index} className="orderItem">
                    <p>{item.name}</p>
                    <p>${item.price}</p>
                  </div>
                ))}
                <div className="orderTotal">
                  <p>Total:</p><h2>${order.total}</h2>
                </div>
              </div>
              <div className="orderStateContainer">
                <h3>Estado:</h3>
                <div className={`orderState ${selectedState}`}>
                  <div className="orderStateRadio">
                    <input type="radio" name={`orderState-${order.id}`} id="waiting" onChange={(e) => handleRadioChange(e, order.id)} checked={order.state === "waiting"} />
                    <label htmlFor="waiting">En espera</label>
                  </div>
                  <div className="orderStateRadio">
                    <input type="radio" name={`orderState-${order.id}`} id="cooking" onChange={(e) => handleRadioChange(e, order.id)} checked={order.state === "cooking"} />
                    <label htmlFor="cooking">En preparación</label>
                  </div>
                  <div className="orderStateRadio">
                    <input type="radio" name={`orderState-${order.id}`} id="ready" onChange={(e) => handleRadioChange(e, order.id)} checked={order.state === "ready"} />
                    <label htmlFor="ready">Listo</label>
                  </div>
                  <div className="orderStateRadio">
                    <input type="radio" name={`orderState-${order.id}`} id="delivered" onChange={(e) => handleRadioChange(e, order.id)} checked={order.state === "delivered"} />
                    <label htmlFor="delivered">Entregado</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;