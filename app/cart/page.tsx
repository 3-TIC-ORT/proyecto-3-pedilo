"use client"; // Client Component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Directory
import styles from './cart.module.css';

interface CartItem {
  itemId: number;
  amount: number;
  title: string;
  price: string;
  total: string;
  observation?: string; // Optional field for observation
  extraCharge?: string; // Optional field for extra charge
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

  // Fetch cart data on component mount
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

  // Handle adding an item to the cart
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

  // Handle deleting an item from the cart
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

  // Format the price to USD
  const formatUSD = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Back button */}
      <button onClick={() => router.back()} className={styles.button}>
        Back
      </button>

      <h1 className={styles.h1_yourCart}>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {/* Cart image */}
          <img src='/media/shoppingCart.svg' alt='Cart image' className={styles.cartImage} />
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Total</th>
                <th>Extra charges</th> {/* New column for extra charges */}
                <th>Action</th>
                <th>Observations</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.itemId}>
                  <td>{item.title}</td>
                  <td>{item.amount}</td>
                  <td>{`$${item.price}`}</td>
                  <td>{`$${item.total}`}</td>
                  <td>{item.extraCharge ? `+ $${item.extraCharge}` : 'No extra charges'}</td> {/* Display extra charges */}
                  <td>
                    <button onClick={() => handleAddToCart(item.itemId)}>Add More</button>
                    <button onClick={() => handleDeleteFromCart(item.itemId)}>Remove</button>
                  </td>
                  <td>{item.observation || 'No observations'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Total: {formatUSD(parseFloat(total))}</h2>

          {/* Centered "Go to Payment" button */}
          <button
            onClick={() => router.push('/payment')} /* Update this path when you have the payment page */
            className={styles.paymentButton}
          >
            Go to Payment
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;