import * as Ably from 'ably';
import { prisma } from '@/prisma';

export const ably = new Ably.Realtime(process.env.ABLY_API_KEY!);
export const ablyClient = new Ably.Rest({ key: process.env.ABLY_API_KEY });

// Create typed channels for different events
export const orderChannel = ably.channels.get('orders');
export const itemChannel = ably.channels.get('orderItems');

// Types for the events
export interface OrderUpdateEvent {
  orderId: number;
  status: string;
  updatedAt: Date;
}

export interface ItemUpdateEvent {
  orderId: number;
  itemId: number;
  status: string;
  updatedAt: Date;
}

// Helper functions to publish events
export async function publishOrderUpdate(orderId: number, status: string) {
  await orderChannel.publish('order-status-update', {
    orderId,
    status,
    updatedAt: new Date()
  });
}

export async function publishItemUpdate(orderId: number, itemId: number, status: string) {
  await itemChannel.publish('item-status-update', {
    orderId,
    itemId,
    status,
    updatedAt: new Date()
  });
}


// In your Ably integration file

export async function publishOrder(orderId: number, status: string) {
  console.log("ordered")
  const orderDetails = await prisma.order.findUnique({
    where: { orderId },
    include: {
      OrderItems: {
        include: { Item: true }
      }
    }
  });

  if (orderDetails) {
    await orderChannel.publish('order-created', {
      orderId: orderDetails.orderId,
      totalAmount: orderDetails.totalAmount,
      orderDate: orderDetails.orderDate,
      tableNumber: orderDetails.tableNumber,
      status: orderDetails.status,
      orderNote: orderDetails.orderNote,
      items: orderDetails.OrderItems.map(item => ({
        itemId: item.itemId,
        title: item.Item.title,
        quantity: item.quantity,
        status: item.status
      }))
    });
    console.log("order published")
  }
}

