import { getItems } from '@/actions/item'; // Import server action
import MenuClient from './MenuClient'; // Client Component for interactions

export default async function Menu() {
  // Fetch menu items using the server action
  const menuItems = await getItems();

  return (
    <div className="masterContainer container">
      <h1 className='headH1'>Menu</h1>
      <MenuClient menuItems={menuItems} /> {/* Pass data to client component */}
    </div>
  );
}

