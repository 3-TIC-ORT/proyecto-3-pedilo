import { auth } from '@/auth';
import React from 'react';
import CartClient from './CartClient';
import CartWaiterClient from './CartWaiterClient';
import { getTables } from '@/actions/tables';
import { checkAccess } from '@/lib/auth-utils';

// Define interfaces based on your Prisma query structure
interface User {
  id: string;
  name: string | null;
  email: string;
}

interface TableUser {
  User: User;
}

interface CartItem {
  Item: {
    id: number;
    title: string;
    price: number;
    // Add other Item fields if needed by CartWaiterClient
  };
  quantity: number;
}

interface Cart {
  CartItems: CartItem[];
}

interface Table {
  tableNumber: number;
  waiterId: string | null;
  Users: TableUser[];
  Waiter: User | null;
  Cart: Cart | null;
}

// Transform function to convert Prisma data to CartWaiterClient expected format
function transformTableData(table: Table): {
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
} {
  return {
    tableNumber: table.tableNumber,
    waiterId: table.waiterId || '',
    Cart: table.Cart ? {
      CartItems: table.Cart.CartItems.map(item => ({
        Item: {
          id: item.Item.id,
          title: item.Item.title,
          price: item.Item.price.toString()
        },
        amount: item.quantity
      }))
    } : undefined
  };
}

export default async function Cart() {
  await checkAccess('/cart');
  try {
    const session = await auth();
    const userRole = session?.user?.role || null;
    const userId = session?.user?.id || null;

    if (userRole === 'waiter' && userId) {
      const waiterTables = await getTables();
      const filteredTables = waiterTables
        .filter((table) => table.waiterId === userId)
        .map(transformTableData);

      return <CartWaiterClient userRole={userRole} waiterTables={filteredTables} />;
    }

    return <CartClient />;
  } catch (error) {
    console.error('Failed to load menu items or user role:', error);
    return (
      <main>
        <div className="container">
          <h1>Ops...</h1>
          <p>Lo sentimos, ocurrio un error al cargar el carrito.</p>
        </div>
      </main>
    );
  }
}
