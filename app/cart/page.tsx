"use client"; // Client Component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Directory
import { getCart, addToCart, removeFromCart } from '@/actions/cart'; // Import the new actions

interface CartItem {
  itemId: number;
  amount: number;
  title: string;
  price: string;
  total: string;
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
        const data = await getCart(); // Use the new getCart function

        if (data) {
          setCart(data.items);
          setTotal(data.total);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        console.log(err);
        setError('An error occurred while fetching the cart.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleAddToCart = async (itemId: number) => {
    try {
      await addToCart(itemId); // Use the new addToCart function
      // Refetch the cart after adding an item
      const updatedCart = await getCart();
      setCart(updatedCart.items);
      setTotal(updatedCart.total);
    } catch (err) {
      console.error('Error adding item to cart:', err);
      alert('Failed to add item to cart.');
    }
  };

  const handleDeleteFromCart = async (itemId: number) => {
    try {
      await removeFromCart(itemId); // Use the new removeFromCart function
      // Refetch the cart after removing an item
      const updatedCart = await getCart();
      setCart(updatedCart.items);
      setTotal(updatedCart.total);
    } catch (err) {
      console.error('Error deleting item from cart:', err);
      alert('Failed to delete item from cart.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
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
    </main>
  );
};

export default CartPage;

