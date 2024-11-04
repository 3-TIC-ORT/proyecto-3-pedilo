import { getItems } from '@/actions/item'; // Import server action
import MenuClient from './MenuClient'; // Client Component for interactions
import { auth } from "@/auth"; // Import auth function
import { Item } from '@prisma/client'; // Ensure this import matches your project setup
import { cookies } from 'next/headers'; // Import cookies from next/headers
import { assignTable } from '@/actions/tables';
import { getTables } from '@/actions/tables';

export default async function Menu() {
  try {
    // Fetch menu items using the server action
    const menuItems = await getItems() as Item[]; // Assert the type to Item[]
    
    // Fetch user role using the server action
    const session = await auth();
    const userRole = session?.user?.role || null;
    const userId = session?.user?.id || null;

    if (userId) {
      const cookieStore = cookies();
      const tableNumber = cookieStore.get('tableNumber')?.value;

      if (tableNumber) {
        await assignTable(Number(tableNumber), userId);
      }
    }

    let filteredTables = null

    if (userRole === 'waiter') {
      const waiterTables = await getTables();
      filteredTables = waiterTables.filter(table => table.Waiter?.id === userId);
    }

    return (
      <main>
        <MenuClient menuItems={menuItems} userRole={userRole} waiterTables={filteredTables}/>
      </main>
    );
  } catch (error) {
    // Handle error (e.g., show an error message)
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
