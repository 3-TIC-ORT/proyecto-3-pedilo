"use server"
import { prisma } from "@/prisma"
import { ablyClient } from '@/lib/ably';
import { Session } from "next-auth";
import { auth } from '@/auth'

async function getSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Usuario no autenticado');
  }
  return session;
}

export async function getTables() {
  return await prisma.table.findMany({
    include: {
      Users: {
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      Waiter: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      Cart: {
        include: {
          CartItems: {
            include: {
              Item: true
            }
          }
        }
      }
    }
  })
}

export async function assignTable(tableNumber: number, userId: string) {
  const table = await prisma.table.findUnique({
    where: { tableNumber },
    include: { Cart: true }
  });

  if (!table) throw new Error("Table not found");

  const assignment = await prisma.$transaction(async (prisma) => {
    // Handle previous table assignment
    const existingAssignment = await prisma.tableUser.findFirst({ where: { userId } });
    if (existingAssignment) {
      await prisma.tableUser.delete({
        where: { userId_tableNumber: { userId, tableNumber: existingAssignment.tableNumber } },
      });
    }

    // Create new table assignment
    const newAssignment = await prisma.tableUser.create({ data: { userId, tableNumber } });

    // If table doesn't have a cart, create one
    if (!table.Cart) {
      await prisma.cart.create({
        data: {
          tableNumber,
          waiterId: table.waiterId || '', // Ensure waiterId is handled appropriately
          status: 'active'
        }
      });
    }

    return newAssignment;
  });

  await ablyClient.channels.get('table-updates').publish('table-assigned', {
    tableNumber,
    userId,
  });

  return assignment;
}

export async function unassignTable(tableNumber: number, userId: string) {
  const table = await prisma.table.findUnique({
    where: { tableNumber },
    include: { Users: true }
  });

  if (!table) throw new Error("Table not found");

  const assignment = await prisma.tableUser.findUnique({
    where: { userId_tableNumber: { userId, tableNumber } },
  });

  if (!assignment) throw new Error("User is not assigned to this table");

  await prisma.$transaction(async (prisma) => {
    // Remove user from table
    await prisma.tableUser.delete({
      where: { userId_tableNumber: { userId, tableNumber } }
    });

    // If this was the last user at the table, clear the cart
    if (table.Users.length === 1) {
      await prisma.cartItem.deleteMany({
        where: { Cart: { tableNumber } }
      });

      await prisma.cart.delete({
        where: { tableNumber }
      });
    }
  });

  await ablyClient.channels.get('table-updates').publish('table-unassigned', {
    tableNumber,
    userId,
  });

  return true;
}

export async function getTableUsers(tableNumber: number) {
  return await prisma.tableUser.findMany({
    where: { tableNumber },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
}

export async function getUserTables(userId?: string) {
  const session = await getSession();
  const user = userId || session.user.id;
  const tableUsers = await prisma.tableUser.findMany({
    where: { userId: user },
    select: {
      tableNumber: true,
      Table: {
        include: {
          Cart: {
            include: {
              CartItems: {
                include: {
                  Item: true
                }
              }
            }
          }
        }
      }
    },
  });
  return tableUsers.map(tu => ({
    tableNumber: tu.tableNumber,
    cart: tu.Table.Cart
  }));
}

export async function assignWaiter(tableNumber: number, waiterId: string) {
  const table = await prisma.table.findUnique({
    where: { tableNumber },
    include: { Cart: true }
  });

  if (!table) throw new Error("Table not found");

  const updatedTable = await prisma.$transaction(async (prisma) => {
    // Update table with new waiter
    const tableUpdate = await prisma.table.update({
      where: { tableNumber },
      data: { waiterId },
    });

    // If there's an active cart, update its waiter as well
    if (table.Cart) {
      await prisma.cart.update({
        where: { tableNumber },
        data: { waiterId }
      });
    }

    return tableUpdate;
  });

  await ablyClient.channels.get('table-updates').publish('waiter-assigned', {
    tableNumber,
    waiterId,
  });

  return updatedTable;
}

export async function unassignWaiter(tableNumber: number) {
  const table = await prisma.table.findUnique({
    where: { tableNumber },
    include: { Cart: true }
  });

  if (!table) throw new Error("Table not found");

  const updatedTable = await prisma.$transaction(async (prisma) => {
    // Remove waiter from table
    const tableUpdate = await prisma.table.update({
      where: { tableNumber },
      data: { waiterId: null },
    });

    // If there's an active cart, remove waiter from it as well
    if (table.Cart) {
      await prisma.cart.update({
        where: { tableNumber },
        data: { waiterId: undefined }
      });
    }

    return tableUpdate;
  });

  await ablyClient.channels.get('table-updates').publish('waiter-unassigned', {
    tableNumber,
  });

  return updatedTable;
}
