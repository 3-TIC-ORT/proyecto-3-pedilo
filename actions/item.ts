"use server"
import { prisma } from '@/prisma';
import { Item } from '@prisma/client'; // Adjust based on your Prisma client setup

export async function getItems(itemId?: number): Promise<Item | Item[]> {
  try {
    if (itemId) {
      // Fetch a single item; handle null appropriately
      const item = await prisma.item.findUnique({
        where: { id: itemId },
      });
      // Ensure the type is Item | null
      return item as Item;
    } else {
      // Fetch all items; this should always be an array
      const items = await prisma.item.findMany();
      return items;
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    throw new Error('Failed to fetch items');
  }
}

export async function createItem(itemData: Item): Promise<Item> {
  try {
    const item = await prisma.item.create({
      data: itemData,
    });
    return item;
  } catch (error) {
    console.error('Error creating item:', error);
    throw new Error('Failed to create item');
  }
}
