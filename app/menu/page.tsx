import { getItems } from '@/actions/item'; // Import server action
import MenuClient from './MenuClient'; // Client Component for interactions
import { Item } from '@prisma/client'; // Ensure this import matches your project setup

export default async function Menu() {
  try {
    // Fetch menu items using the server action
    const menuItems = await getItems() as Item[]; // Assert the type to Item[]

    return (
      <main>
        <MenuClient menuItems={menuItems} />
      </main>
    );
  } catch (error) {
    // Handle error (e.g., show an error message)
    console.error('Failed to load menu items:', error);
    return <p>Error loading menu items</p>;
  }
}

