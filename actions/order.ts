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

  if (tableUsers.length === 0) {
    throw new Error('Table not selected');
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
    const newOrder = await prisma.order.create({
      data: {
        totalAmount,
        orderDate: new Date(),
        tableNumber,
        orderNote,
        status: 'Pending',
      }
    });

    await prisma.orderUser.createMany({
      data: tableUsers.map((tableUser) => ({
        orderId: newOrder.orderId,
        userId: tableUser.userId
      }))
    });

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
    where: { orderId },
    data: { status },
  });

  await prisma.orderItem.updateMany({
    where: { orderId },
    data: { status },
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

