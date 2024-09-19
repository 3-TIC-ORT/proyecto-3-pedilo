import { prisma } from '@/prisma';
import { auth } from '@/auth';
import { Session } from 'next-auth';

async function getSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('User not authenticated');
  }
  return session;
}

export async function getCart(userId?: string) {
  try {
    const session = await getSession(); // Ensure user is authenticated
    userId = userId || session.user.id;

    const items = await prisma.cart.findMany({
      where: { userId },
      include: { Item: true },
    });

    let total = 0;
    const formattedItems = items.map((item) => {
      const itemTotal = item.Item.price * (item.amount || 0);
      total += itemTotal;
      return {
        itemId: item.itemId,
        title: item.Item.title,
        amount: item.amount,
        total: formatUSD(itemTotal),
        price: formatUSD(item.Item.price),
      };
    });

    return { items: formattedItems, total: formatUSD(total) };
  } catch (error) {
    throw new Error('Failed to fetch cart');
  }
}

export async function addToCart(itemId: number, userId?: string) {
  try {
    const session = await getSession(); // Ensure user is authenticated
    userId = userId || session.user.id;

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      throw new Error('Invalid item');
    }

    const cartItem = await prisma.cart.findFirst({
      where: { userId, itemId },
    });

    if (cartItem) {
      await prisma.cart.update({
        where: { itemId_userId: { itemId, userId } },
        data: { amount: { increment: 1 } },
      });
    } else {
      await prisma.cart.create({
        data: { itemId, userId, amount: 1 },
      });
    }

    return { message: 'Item added to cart' };
  } catch (error) {
    throw new Error('Failed to add item to cart');
  }
}

export async function removeFromCart(itemId: number, userId?: string) {
  try {
    const session = await getSession(); // Ensure user is authenticated
    userId = userId || session.user.id;

    const cartItem = await prisma.cart.findFirst({
      where: { itemId, userId },
    });

    if (!cartItem) {
      throw new Error('Item not found in cart');

    }

    if (cartItem.amount > 1) {
      await prisma.cart.update({
        where: { itemId_userId: { itemId, userId } },
        data: { amount: { decrement: 1 } },
      });
    } else {
      await prisma.cart.delete({
        where: { itemId_userId: { itemId, userId } },
      });
    }

    return { message: 'Item updated/removed from cart' };
  } catch (error) {
    throw new Error('Failed to remove item from cart');
  }
}

export async function clearCart(userId?: string) {
  try {
    const session = await getSession(); // Ensure user is authenticated
    userId = userId || session.user.id;

    await prisma.cart.deleteMany({ where: { userId } });
    return { message: 'Cart cleared' };
  } catch (error) {
    throw new Error('Failed to clear cart');
  }
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

