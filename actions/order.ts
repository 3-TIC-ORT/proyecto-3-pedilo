'use server'
import { prisma } from '@/prisma';
import { auth } from '@/auth';
import { Session } from "next-auth";

// Helper function to handle session authentication
async function getSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('User not authenticated');
  }
  return session;
}

export async function getAllOrders() {
  const orders = await prisma.order.findMany({
    include: { OrderItems: { include: { Item: true } } },
  });

  const formattedOrders = orders.map((order) => ({
    orderId: order.orderId,
    totalAmount: order.totalAmount,
    orderDate: order.orderDate,
    tableNumber: order.tableNumber,
    orderStatus: order.status,
    items: order.OrderItems.map((orderItem) => ({
      itemId: orderItem.itemId,
      title: orderItem.Item.title,
      quantity: orderItem.quantity,
    })),
  }));

  return formattedOrders;
}

export async function orderItemStatus(itemId: number, status: string, orderId: number) {
  // Update the status of the specific item in the order
  await prisma.orderItem.update({
    where: {
      orderId_itemId: {
        orderId: orderId,
        itemId: itemId,
      },
    },
    data: { status: status },
  });
  // Check if all order items are prepared
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
  });

  const allItemsPrepared = orderItems.every((item) => item.status === 'prepared');
  if (allItemsPrepared) {
    await prisma.order.update({
      where: { orderId },
      data: { status: 'ready' },
    });
  }

  return { message: `Item status updated to ${status}` };
}

export async function getOrders(userId?: string) {
  // Authenticate the user using getSession
  const session = await getSession();
  const user = userId || session.user.id;

  // Fetch all orders for the user
  const orders = await prisma.order.findMany({
    where: { userId: user },
    orderBy: { orderDate: 'desc' },
    include: { OrderItems: { include: { Item: true } } },
  });

  // Format the order data for the response
  const formattedOrders = orders.map((order) => ({
    orderId: order.orderId,
    totalAmount: order.totalAmount,
    orderDate: order.orderDate,
    tableNumber: order.tableNumber,
    status: order.status,         // Added status
    orderNote: order.orderNote,   // Added orderNote
    items: order.OrderItems.map((orderItem) => ({
      itemId: orderItem.itemId,
      title: orderItem.Item.title,
      quantity: orderItem.quantity,
    })),
  }));
  return formattedOrders;
}

export async function createOrder(userId?: string, orderNote?: string) {  // Added orderNote parameter
  // Authenticate the user using getSession
  const session = await getSession();
  const user = userId || session.user.id;
  // Fetch cart items for the user
  const cartItems = await prisma.cart.findMany({
    where: { userId: user },
    include: { Item: true },
  });
  if (!cartItems.length) {
    throw new Error('Cart is empty');
  }
  // Fetch table number for the user
  const tableUser = await prisma.tableUser.findFirst({
    where: { userId: user },
    select: { tableNumber: true },
  });
  if (!tableUser) {
    throw new Error('Table not selected');
  }
  // Calculate the total amount for the order
  const totalAmount = cartItems.reduce((acc, cartItem) => {
    return acc + (cartItem.amount * cartItem.Item.price);
  }, 0);
  // Create a new order for the user
  const order = await prisma.order.create({
    data: {
      userId: user,
      totalAmount: totalAmount,
      orderDate: new Date(),
      tableNumber: tableUser.tableNumber,
      orderNote: orderNote,  // Added orderNote
    },
  });
  const orderId = order.orderId;
  // Insert each item from the cart into the OrderItem table
  for (const cartItem of cartItems) {
    await prisma.orderItem.create({
      data: {
        orderId: orderId,
        itemId: cartItem.itemId,
        quantity: cartItem.amount || 0,
      },
    });
  }
  // Clear the user's cart after order creation
  await prisma.cart.deleteMany({
    where: { userId: user },
  });
  // Return success response with the new order ID
  return { message: 'Order created successfully', orderId: orderId };
}
export async function changeOrderStatus(orderId: number, status: string) {
  // Await the update operations to ensure they complete before proceeding
  await prisma.order.update({
    where: { orderId: orderId },
    data: { status },
  });
  await prisma.orderItem.updateMany({
    where: { orderId: orderId },
    data: { status },
  });

  return { message: 'Order status updated successfully', orderId: orderId };
}

export async function ChangeItemStatus(orderId: number, itemId: number, status: string) {
  try {
    // Update the status of the specific item in the order
    const updatedItem = await prisma.orderItem.update({
      where: {
        orderId_itemId: {
          orderId: orderId,
          itemId: itemId,
        },
      },
      data: { status },
    });

    if (!updatedItem) {
      throw new Error('Item not found in the order');
    }

    // Check if all order items are prepared
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
    });

    const allItemsPrepared = orderItems.every((item) => item.status === 'prepared');

    if (allItemsPrepared) {
      // Await the changeOrderStatus to ensure the order status is updated before proceeding
      await changeOrderStatus(orderId, "ready");
    }

    return { message: `Item status updated to ${status}` };
  } catch (error) {
    console.error('Error updating item status:', error);
    throw new Error('Failed to update item status');
  }
}

