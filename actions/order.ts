import { prisma } from '@/prisma';
import { auth } from '@/auth';

export async function getAllOrders() {
  const orders = await prisma.order.findMany({
    include: { orderItems: { include: { item: true } } },
  });

  const formattedOrders = orders.map((order) => {
    return {
      orderId: order.orderId,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
      tableNumber: order.tableNumber,
      items: order.orderItems.map((orderItem) => {
        return {
          itemId: orderItem.itemId,
          title: orderItem.item.title,
          quantity: orderItem.quantity,
        };
      }),
    };
  });

  return formattedOrders;
}

export async function orderItemStatus(itemId: number, status: string, orderId: number) {

  // also change status of order when all items are prepared:
  const orderItem = await prisma.orderItem.update({
    where: { itemId_orderId: { itemId, orderId } },
    data: { status: status },
  });
  // check if all items are prepared
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
  });
  const allItemsPrepared = orderItems.every((item) => item.status === true);
  if (allItemsPrepared) {
    await prisma.order.update({
      where: { orderId },
      data: { status: 'ready' },
    });
  }


  return { message: `Item status updated to ${status}` };

}

export async function getOrders(userId?: string) {
  // Authenticate the user
  const session = await auth();
  if (!session.user) {
    throw new Error('User not authenticated');
  }
  const user = userId || session.user.id;

  // Fetch all orders for the user
  const orders = await prisma.order.findMany({
    where: { userId: user },
    orderBy: { orderDate: 'desc' },
    include: { orderItems: { include: { item: true } } },
  });

  // Format the order data for the response
  const formattedOrders = orders.map((order) => {
    return {
      orderId: order.orderId,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
      tableNumber: order.tableNumber,
      items: order.orderItems.map((orderItem) => {
        return {
          itemId: orderItem.itemId,
          title: orderItem.item.title,
          quantity: orderItem.quantity,
        };
      }),
    };
  });

  return formattedOrders;
}


export async function createOrder(userId?: string) {

  // Authenticate the user
  const session = await auth();
  if (!session.user) {
    throw new Error('User not authenticated');
  }
  const user = userId || session.user.id;

  // Fetch cart items for the user, grouped by itemId
  const cartItems = await prisma.cart.groupBy({
    by: ['itemId'],
    where: {
      userId: user,
    },
    _sum: {
      amount: true, // Sum the amounts in the cart
    },
  });

  if (!cartItems.length) {
    throw new Error('Cart is empty');
  }

  // Fetch table number for the user
  const tableData = await prisma.table.findUnique({
    where: { userId: user },
    select: { tableNumber: true },
  });

  if (!tableData) {
    throw new Error('Table not selected');
  }

  // Calculate the total amount: sum(price * amount) for each cart item
  const totalAmount = await prisma.cart.aggregate({
    _sum: {
      totalCost: {
        _raw: `(amount * items.price)`, // Custom SQL calculation for total cost
      },
    },
    where: { userId: user },
    include: {
      item: {
        select: { price: true }, // Get item prices
      },
    },
  });

  if (!totalAmount._sum.totalCost) {
    throw new Error('Error calculating total amount');
  }

  // Create a new order for the user
  const order = await prisma.order.create({
    data: {
      userId: user,
      totalAmount: totalAmount._sum.totalCost, // Calculated total amount
      orderDate: new Date(),
      tableNumber: tableData.tableNumber, // User's table number
    },
  });

  const orderId = order.orderId; // Primary key for the new order

  // Insert each item from the cart into the OrderItem table
  for (const cartItem of cartItems) {
    await prisma.orderItem.create({
      data: {
        orderId: orderId,           // Reference to the created order
        itemId: cartItem.itemId,     // Item ID from the cart
        quantity: cartItem._sum.amount || 0, // Sum of the item quantities
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

