'use server'
import { prisma } from '@/prisma';
import { auth } from '@/auth';
import { Session } from "next-auth";

async function getSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('User not authenticated');
  }
  return session;
}

export async function getAllOrders() {
  const orders = await prisma.order.findMany({
    include: {
      OrderItems: {
        include: { Item: true }
      },
      User: {
        select: {
          name: true,
          email: true
        }
      }
    },
  });

  const formattedOrders = orders.map((order) => ({
    orderId: order.orderId,
    totalAmount: order.totalAmount,
    orderDate: order.orderDate,
    tableNumber: order.tableNumber,
    status: order.status,
    orderNote: order.orderNote,
    orderStatus: order.status,
    orderedBy: order.User.name || order.User.email,
    items: order.OrderItems.map((orderItem) => ({
      itemId: orderItem.itemId,
      title: orderItem.Item.title,
      quantity: orderItem.quantity,
      status: orderItem.status
    })),
  }));

  return formattedOrders;
}

export async function orderItemStatus(itemId: number, status: string, orderId: number) {
  await prisma.orderItem.update({
    where: {
      orderId_itemId: {
        orderId: orderId,
        itemId: itemId,
      },
    },
    data: { status: status },
  });

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
  const session = await getSession();
  const user = userId || session.user.id;

  const orders = await prisma.order.findMany({
    where: { userId: user },
    orderBy: { orderDate: 'desc' },
    include: {
      OrderItems: {
        include: { Item: true }
      }
    },
  });

  const formattedOrders = orders.map((order) => ({
    orderId: order.orderId,
    totalAmount: order.totalAmount,
    orderDate: order.orderDate,
    tableNumber: order.tableNumber,
    status: order.status,
    orderNote: order.orderNote,
    items: order.OrderItems.map((orderItem) => ({
      itemId: orderItem.itemId,
      title: orderItem.Item.title,
      quantity: orderItem.quantity,
      status: orderItem.status
    })),
  }));
  return formattedOrders;
}

export async function createOrder(userId?: string, orderNote?: string, tableNumber?: number) {
  const session = await getSession();
  const user = userId || session.user.id;

  // First, find the table the user is assigned to
  const tableUser = await prisma.tableUser.findFirst({
    where: { userId: user },
    include: {
      Table: {
        include: {
          Cart: {
            include: {
              CartItems: {
                include: { Item: true }
              }
            }
          }
        }
      }
    }
  });

  if (!tableUser) {
    throw new Error('Table not selected');
  }

  const cart = tableUser.Table.Cart;
  if (!cart || !cart.CartItems.length) {
    throw new Error('Cart is empty');
  }

  // Calculate the total amount for the order
  const totalAmount = cart.CartItems.reduce((acc, cartItem) => {
    return acc + (cartItem.quantity * cartItem.Item.price);
  }, 0);

  // Create the order within a transaction
  const order = await prisma.$transaction(async (prisma) => {
    // Create the order
    const newOrder = await prisma.order.create({
      data: {
        userId: user,
        totalAmount,
        orderDate: new Date(),
        tableNumber: tableUser.tableNumber,
        orderNote,
        status: 'Pending'
      },
    });

    // Create order items from cart items
    for (const cartItem of cart.CartItems) {
      await prisma.orderItem.create({
        data: {
          orderId: newOrder.orderId,
          itemId: cartItem.itemId,
          quantity: cartItem.quantity,
          status: 'Pending'
        },
      });
    }

    // Clear the cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return newOrder;
  });

  return {
    message: 'Order created successfully',
    orderId: order.orderId
  };
}

export async function changeOrderStatus(orderId: number, status: string) {
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

    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
    });

    const allItemsPrepared = orderItems.every((item) => item.status === 'prepared');

    if (allItemsPrepared) {
      await changeOrderStatus(orderId, "ready");
    }

    return { message: `Item status updated to ${status}` };
  } catch (error) {
    console.error('Error updating item status:', error);
    throw new Error('Failed to update item status');
  }
}
