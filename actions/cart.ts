"use server";
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

// Retrieve the cart for a specific table
export async function getCart(tableNumber?: number) {
  try {
    const session = await getSession();
    if (!session) throw new Error('User is not authenticated.');

    // Retrieve the user's table number if not provided as a parameter
    if (!tableNumber) {
      const userTable = await prisma.tableUser.findFirst({
        where: { userId: session.user.id },
        select: { tableNumber: true },
      });
      if (!userTable || !userTable.tableNumber) throw new Error('Table number not found for user.');
      tableNumber = userTable.tableNumber;
    }
    const cart = await prisma.cart.findUnique({
      where: { tableNumber },
      include: {
        CartItems: {
          include: {
            Item: true
          }
        }
      }
    });

    if (!cart) throw new Error('Carrito no encontrado para esta mesa');

    let total = 0;
    const formattedItems = cart.CartItems.map((cartItem) => {
      const itemTotal = cartItem.Item.price * (cartItem.quantity || 0);
      total += itemTotal;
      return {
        itemId: cartItem.itemId,
        title: cartItem.Item.title,
        amount: cartItem.quantity,
        total: formatUSD(itemTotal),
        price: formatUSD(cartItem.Item.price),
      };
    });

    return { items: formattedItems, total: formatUSD(total) };
  } catch (error) {
    throw new Error('Error al obtener el carrito');
  }
}

// Add an item to the cart for a specific table
export async function addToCart(tableNumber: number, itemId: number, quantity: number = 1) {
  try {
    const session = await getSession();

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) throw new Error('Invalid item');

    // Find or create the cart for this table
    const cart = await prisma.cart.upsert({
      where: { tableNumber },
      update: {},
      create: {
        tableNumber,
        waiterId: session.user.id,  // Assigned waiter based on current user
      }
    });

    // Find existing CartItem or create a new one
    const cartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, itemId }
    });

    const newQuantity = cartItem ? cartItem.quantity + quantity : quantity;

    if (newQuantity > 99) throw new Error('Cannot add more than 99 items to the cart');

    if (cartItem) {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          itemId,
          quantity
        }
      });
    }

    // Publish Ably event for cart updates
    await ablyClient.channels.get('cart-updates').publish('item-updated', {
      tableNumber,
      action: 'add',
      itemId,
      newQuantity
    });

    return { message: 'Item added to cart' };
  } catch (error) {
    throw new Error('Error adding item to cart');
  }
}

// Remove an item from the cart for a specific table
export async function removeFromCart(tableNumber: number, itemId: number, quantity: number = 1) {
  try {
    const session = await getSession();

    const cart = await prisma.cart.findUnique({
      where: { tableNumber },
      include: { CartItems: true }
    });

    if (!cart) throw new Error('Cart not found for this table');

    const cartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, itemId }
    });

    if (!cartItem) throw new Error('Item not found in cart');

    const newQuantity = cartItem.quantity - quantity;

    if (newQuantity < 1) {
      await prisma.cartItem.delete({ where: { id: cartItem.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: newQuantity }
      });
    }

    // Publish Ably event for cart updates
    await ablyClient.channels.get('cart-updates').publish('item-updated', {
      tableNumber,
      action: 'remove',
      itemId,
      newQuantity: Math.max(newQuantity, 0)
    });

    return { message: 'Item removed from cart' };
  } catch (error) {
    throw new Error('Error removing item from cart');
  }
}

// Clear all items from the cart for a specific table
export async function clearCart(tableNumber?: number) {
  try {
    const session = await getSession();
    if (!session) throw new Error('User is not authenticated.');

    // Retrieve the user's table number if not provided as a parameter
    if (!tableNumber) {
      const userTable = await prisma.tableUser.findFirst({
        where: { userId: session.user.id },
        select: { tableNumber: true },
      });
      if (!userTable || !userTable.tableNumber) throw new Error('Table number not found for user.');
      tableNumber = userTable.tableNumber;
    }


    const cart = await prisma.cart.findUnique({ where: { tableNumber } });
    if (!cart) throw new Error('Cart not found for this table');

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Publish Ably event for cart clearance
    await ablyClient.channels.get('cart-updates').publish('cart-cleared', {
      tableNumber,
    });

    return { message: 'Carrito vaciado' };
  } catch (error) {
    throw new Error('Error al vaciar el carrito');
  }
}

// Helper function to format USD
function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

