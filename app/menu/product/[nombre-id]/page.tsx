import { getItems } from '@/actions/item'; // Import server action
import ProductClient from './ProductClient'; // Client component for interactions
import './product.css'; // Import styles
import { Item } from '@prisma/client';

interface ProductPageProps {
  params: { 'nombre-id': string }; // URL parameters
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = parseInt(params['nombre-id'].split('-').pop() || '0', 10); // Extract and parse the product ID
  const product = await getItems(productId) as Item;

  return (
    <ProductClient product={product} />
  );
}

