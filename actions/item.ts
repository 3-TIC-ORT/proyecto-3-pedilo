import { prisma } from '@/prisma';

export async function getItems(itemId?: number) {
  try {
    // Fetch all items from the database
    if (itemId) {
      const item = await prisma.item.findUnique({
        where: {
          id: itemId,
        },
      });
      return item;
    }
    const items = await prisma.item.findMany();
    return items;
  } catch (error) {
    throw new Error('Failed to fetch items');
  }
}
