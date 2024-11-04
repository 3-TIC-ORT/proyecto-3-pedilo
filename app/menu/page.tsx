import { getItems } from '@/actions/item';
import MenuClient from './MenuClient';
import { auth } from "@/auth";
import { Item } from '@prisma/client';
import { cookies } from 'next/headers';
import { assignTable, getTables } from '@/actions/tables';

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

// Transform function to match MenuClient expectations
function transformTableData(table: Table) {
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

export default async function Menu() {
  try {
    // Fetch menu items using the server action
    const menuItems = await getItems() as Item[];

    // Fetch user role and handle table assignment
    const session = await auth();
    const userRole = session?.user?.role || null;
    const userId = session?.user?.id || null;

    // Handle table assignment for logged-in users
    if (userId) {
      const cookieStore = cookies();
      const tableNumber = cookieStore.get('tableNumber')?.value;
      if (tableNumber) {
        await assignTable(Number(tableNumber), userId);
      }
    }

    // Handle waiter tables
    let waiterTables = null;
    if (userRole === 'waiter' && userId) {
      const tables = await getTables();
      const filteredTables = tables
        .filter(table => table.Waiter?.id === userId)
        .map(transformTableData);
      waiterTables = filteredTables;
    }

    return (
      <main>
        <MenuClient
          menuItems={menuItems}
          userRole={userRole}
          waiterTables={waiterTables}
        />
      </main>
    );
  } catch (error) {
    console.error('Failed to load menu items or user role:', error);
    return (
      <main>
        <div className="container">
          <h1>Ops...</h1>
          <p>Lo sentimos, ocurrio un error al cargar el menu.</p>
          <p>Prueba refrezcar la pagina o intentarlo más tarde.</p>
        </div>
      </main>
    );
  }
}
