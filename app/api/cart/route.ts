import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession, isAuthenticated } from '@/lib/auth'; // Assume this function gets the user session

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

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
      total: itemTotal,
      price: item.Item.price,
    };
  });

  return NextResponse.json({ items: formattedItems, total: total });
}

export async function POST(request: Request) {
  const session = await isAuthenticated(request);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { itemId } = await request.json();

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) {
    return NextResponse.json({ error: 'Invalid item' }, { status: 400 });
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

  return NextResponse.json({ message: 'Item added to cart' });
}

// New DELETE function
export async function DELETE(request: Request) {
  const session = await isAuthenticated(request);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { itemId } = await request.json();

  try {
    // Check if the cart item exists
    const cartItem = await prisma.cart.findFirst({
      where: { itemId, userId },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    // If the amount is greater than 1, just decrement it
    if (cartItem.amount > 1) {
      await prisma.cart.update({
        where: { itemId_userId: { itemId, userId } },
        data: { amount: { decrement: 1 } },
      });
    } else {
      // Otherwise, delete the item from the cart
      await prisma.cart.delete({
        where: { itemId_userId: { itemId, userId } },
      });
    }

    return NextResponse.json({ message: 'Item updated/removed from cart' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json({ error: 'Failed to delete item from cart' }, { status: 500 });
  }
}
// function formatUSD(amount: number): string {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//   }).format(amount);
// }
