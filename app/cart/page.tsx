import { auth } from '@/auth';
import React from 'react'
import CartClient from './CartClient';
import CartWaiterClient from './CartWaiterClient';
import { getTables } from '@/actions/tables';

export default async function Cart() {
  try {
    // Fetch user role using the server action
    const session = await auth();
    const userRole = session?.user?.role || null;
    const userId = session?.user?.id || null;

    if (userRole === 'waiter') {
      const waiterTables = await getTables();
      let filteredTables = waiterTables.filter(table => table.Waiter?.id === userId);
      return <CartWaiterClient userRole={userRole} waiterTables={filteredTables}/>;
    }
    return <CartClient userRole={userRole} />;
  } catch (error) {
    // Handle error (e.g., show an error message)
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
