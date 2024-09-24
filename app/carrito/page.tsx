"use client"; // Client Component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Directory

interface CartItem {
  itemId: number;
  amount: number;
  title: string;
  price: string;
  total: string;
}

interface CartResponse {
  items: CartItem[];
  total: string;
  error?: string;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Correct usage with App Directory

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        const data: CartResponse = await response.json();

        if (response.ok) {
          setCart(data.items);
          setTotal(data.total);
        } else {
          setError(data.error || 'Failed to fetch cart items.');
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('An error occurred while fetching the cart.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleAddToCart = async (itemId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedCartResponse = await fetch('/api/cart');
        const updatedCart: CartResponse = await updatedCartResponse.json();

        if (updatedCartResponse.ok) {
          setCart(updatedCart.items);
          setTotal(updatedCart.total);
        }
      } else {
        alert(data.error || 'Failed to add item to cart.');
      }
    } catch (err) {
      console.error('Error adding item to cart:', err);
    }
  };

  const handleDeleteFromCart = async (itemId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedCartResponse = await fetch('/api/cart');
        const updatedCart: CartResponse = await updatedCartResponse.json();

        if (updatedCartResponse.ok) {
          setCart(updatedCart.items);
          setTotal(updatedCart.total);
        }
      } else {
        alert(data.error || 'Failed to delete item from cart.');
      }
    } catch (err) {
      console.error('Error deleting item from cart:', err);
    }
  };

  const formatUSD = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.itemId}>
                  <td>{item.title}</td>
                  <td>{item.amount}</td>
                  <td>{item.price}</td>
                  <td>{item.total}</td>
                  <td>
                    <button onClick={() => handleAddToCart(item.itemId)}>Add More</button>
                    <button onClick={() => handleDeleteFromCart(item.itemId)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Total: {total}</h2>
        </>
      )}
    </div>
  );
};

export default CartPage;