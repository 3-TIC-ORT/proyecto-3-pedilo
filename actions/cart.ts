"use server"
import { prisma } from '@/prisma';
import { auth } from '@/auth';
import { Session } from 'next-auth';
import { ablyClient } from '@/lib/ably';

async function getSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Usuario no autenticado');
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
    throw new Error('Error al obtener el carrito');
  }
}

export async function addToCart(itemId: number, userId?: string, quantity: number = 1) {
  try {
    const session = await getSession();
    userId = userId || session.user.id;

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) throw new Error('Invalid item');

    const cartItem = await prisma.cart.findFirst({ where: { userId, itemId } });
    const newAmount = cartItem ? cartItem.amount + quantity : quantity;

    if (newAmount > 99) throw new Error('Cannot add more than 99 items to the cart');

    if (cartItem) {
      await prisma.cart.update({ where: { itemId_userId: { itemId, userId } }, data: { amount: { increment: quantity } } });
    } else {
      await prisma.cart.create({ data: { itemId, userId, amount: quantity } });
    }

    // Publish Ably event when an item is added to the cart
    await ablyClient.channels.get('cart-updates').publish('item-updated', {
      userId,
      action: 'add',
      itemId,
      newAmount
    });

    return { message: 'Item added to cart' };
  } catch (error) {
    throw new Error('Error adding item to cart: ');
  }
}
export async function removeFromCart(itemId: number, userId?: string, quantity: number = 1) {
  try {
    const session = await getSession();
    userId = userId || session.user.id;

    const cartItem = await prisma.cart.findFirst({ where: { itemId, userId } });
    if (!cartItem) throw new Error('Item not found in cart');

    const newAmount = cartItem.amount - quantity;

    if (newAmount < 1) {
      await prisma.cart.delete({ where: { itemId_userId: { itemId, userId } } });
    } else {
      await prisma.cart.update({ where: { itemId_userId: { itemId, userId } }, data: { amount: { decrement: quantity } } });
    }

    // Publish Ably event when an item is removed or updated in the cart
    await ablyClient.channels.get('cart-updates').publish('item-updated', {
      userId,
      action: 'remove',
      itemId,
      newAmount: Math.max(newAmount, 0)
    });

    return { message: 'Item removed from cart' };
  } catch (error) {
    throw new Error('Error removing item from cart: ');
  }
}
export async function clearCart(userId?: string) {
  try {
    const session = await getSession(); // Ensure user is authenticated
    userId = userId || session.user.id;

    await prisma.cart.deleteMany({ where: { userId } });
    return { message: 'Carrito vaciado' };
  } catch (error) {
    throw new Error('Error al vaciar el carrito');
  }
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

