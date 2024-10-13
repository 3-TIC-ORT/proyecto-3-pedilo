"use server"
import { prisma } from '@/prisma';
import { auth } from '@/auth';
import { Session } from 'next-auth';

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
    const session = await getSession(); // Ensure user is authenticated
    userId = userId || session.user.id;

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      throw new Error('Item invalido');
    }

    const cartItem = await prisma.cart.findFirst({
      where: { userId, itemId },
    });

    if (cartItem) {
      const newAmount = cartItem.amount + quantity;
      if (newAmount > 99) {
        throw new Error('No se pueden agregar más de 99 del mismo artículo al carrito');
      }
      await prisma.cart.update({
        where: { itemId_userId: { itemId, userId } },
        data: { amount: { increment: quantity } },
      });
    } else {
      if (quantity > 99) {
        throw new Error('No se pueden agregar más de 99 del mismo artículo al carrito');
      }
      await prisma.cart.create({
        data: { itemId, userId, amount: quantity },
      });
    }

    return { message: 'Item added to cart' };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error al agregar el item al carrito: ' + error.message);
    } else {
      throw new Error('Error al agregar el item al carrito');
    }
  }
}

export async function removeFromCart(itemId: number, userId?: string, quantity: number = 1) {
  try {
    const session = await getSession(); // Ensure user is authenticated
    userId = userId || session.user.id;

    const cartItem = await prisma.cart.findFirst({
      where: { itemId, userId },
    });

    if (!cartItem) {
      throw new Error('No se encontró el item en el carrito');
    }

    const newAmount = cartItem.amount - quantity;
    if (newAmount < 1) {
      await prisma.cart.delete({
        where: { itemId_userId: { itemId, userId } },
      });
    } else {
      await prisma.cart.update({
        where: { itemId_userId: { itemId, userId } },
        data: { amount: { decrement: quantity } },
      });
    }

    return { message: 'Se removio/actualizo el item del carrito' };
  } catch (error) {
    throw new Error('Error al remover el item del carrito');
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

