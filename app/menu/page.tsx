import { getItems } from '@/actions/item'; // Import server action
import MenuClient from './MenuClient'; // Client Component for interactions
import { auth } from "@/auth"; // Import auth function
import { Item } from '@prisma/client'; // Ensure this import matches your project setup

export default async function Menu() {
  try {
    // Fetch menu items using the server action
    const menuItems = await getItems() as Item[]; // Assert the type to Item[]
    
    // Fetch user role using the server action
    const session = await auth();
    const userRole = session?.user?.role || null;

    return (
      <main>
        <MenuClient menuItems={menuItems} userRole={userRole} />
      </main>
    );
  } catch (error) {
    // Handle error (e.g., show an error message)
    console.error('Failed to load menu items or user role:', error);
    return <p>Error loading menu items or user role</p>;
  }
}