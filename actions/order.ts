'use server'
import { prisma } from '@/prisma';
import { auth } from '@/auth';
import { Session } from "next-auth";
import { ablyClient } from '@/lib/ably';
import { newCall } from '@/actions/calls';

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
        include: {
          Item: true // Include all details about the item
        }
      },
      Users: { // Access users through the OrderUser join table
        include: {
          User: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  const formattedOrders = orders.map((order) => ({
    orderId: order.orderId,
    totalAmount: order.totalAmount,
    orderDate: order.orderDate,
    tableNumber: order.tableNumber,
    status: order.status,
    orderNote: order.orderNote,
    orderStatus: order.status,
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
        orderId,
        itemId,
      },
    },
    data: { status },
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
    where: {
      Users: {
        some: {
          userId: user
        }
      }
    },
    orderBy: { orderDate: 'desc' },
    include: {
      OrderItems: {
        include: { Item: true }
      }
    },
  });

  return orders.map(order => ({
    orderId: order.orderId,
    totalAmount: order.totalAmount,
    orderDate: order.orderDate,
    tableNumber: order.tableNumber,
    status: order.status,
    orderNote: order.orderNote,
    items: order.OrderItems.map(orderItem => ({
      itemId: orderItem.itemId,
      title: orderItem.Item.title,
      quantity: orderItem.quantity,
      status: orderItem.status
    })),
  }));
}

export async function createOrder(tableNumber: number, orderNote?: string) {
  const session = await getSession();
  if (!session || !session.user?.id) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id;

  // Check if the user is a waiter
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isWaiter = user.role === 'waiter';

  // Find users assigned to the specified table
  const tableUsers = await prisma.tableUser.findMany({
    where: { tableNumber },
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

  // If there are no users assigned to the table and the requester is not a waiter, throw an error
  if (tableUsers.length === 0 && !isWaiter) {
    throw new Error('No users assigned to this table');
  }

  const table = tableUsers[0].Table;
  const cart = table?.Cart;

  if (!cart || cart.CartItems.length === 0) {
    throw new Error('Cart is empty');
  }

  const totalAmount = cart.CartItems.reduce((acc, cartItem) => {
    return acc + cartItem.quantity * cartItem.Item.price;
  }, 0);

  const order = await prisma.$transaction(async (prisma) => {
    // Create the new order
    const newOrder = await prisma.order.create({
      data: {
        totalAmount,
        orderDate: new Date(),
        tableNumber,
        orderNote,
        status: 'Pending',
      }
    });

    // Always assign the order to all users at the table
    await prisma.orderUser.createMany({
      data: tableUsers.map((tableUser) => ({
        orderId: newOrder.orderId,
        userId: tableUser.userId
      }))
    });

    // Create order items based on the cart
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

    // Clear the cart after creating the order
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
    await ablyClient.channels.get('cart-updates').publish('cart-cleared', {
      tableNumber,
    });

    await ablyClient.channels.get('order-updates').publish('order-created', {
      user: userId
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
    where: { orderId },
    data: { status },
  });

  await prisma.orderItem.updateMany({
    where: { orderId },
    data: { status },
  });

  const updatedOrder = await prisma.order.update({
    where: { orderId },
    data: { status },
    include: {
      OrderItems: {
        include: {
          Item: true
        }
      }
    }
  });
  if (!updatedOrder.tableNumber) {
    throw new Error('Order does not have a table number');
  }
  newCall(updatedOrder.tableNumber, 'La orden esta lista');

  await ablyClient.channels.get('order-updates').publish('order-status-change', {
    orderId,
    status,
    items: updatedOrder.OrderItems.map(item => ({
      itemId: item.Item.id,
      title: item.Item.title,
      quantity: item.quantity,
      status
    }))
  });

  return { message: 'Order status updated successfully', orderId };
}

export async function ChangeItemStatus(orderId: number, itemId: number, status: string) {
  const updatedItem = await prisma.orderItem.update({
    where: {
      orderId_itemId: {
        orderId,
        itemId,
      },
    },
    data: { status },
  });

  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
  });

  const allItemsPrepared = orderItems.every((item) => item.status === 'prepared');
  if (allItemsPrepared) {
    await changeOrderStatus(orderId, "ready");
  }

  return { message: `Item status updated to ${status}` };
}

