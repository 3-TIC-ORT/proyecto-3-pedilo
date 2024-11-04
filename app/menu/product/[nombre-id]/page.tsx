import { getItems } from '@/actions/item'; // Import server action
import ProductClient from './ProductClient'; // Client component for interactions
import './product.css'; // Import styles
import { Item } from '@prisma/client';
import { auth } from '@/auth';

interface ProductPageProps {
  params: Promise<{ 'nombre-id': string }>; // URL parameters
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const productId = parseInt(params['nombre-id'].split('-').pop() || '0', 10); // Extract and parse the product ID
  const product = await getItems(productId) as Item;
  const session = await auth();
  const userRole = session?.user.role ?? null; // Ensure userRole is either a string or null

  return (
    <ProductClient product={product} userRole={userRole} />
  );
}