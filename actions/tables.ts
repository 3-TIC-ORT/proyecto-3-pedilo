"use server"
import { prisma } from "@/prisma"
import { ablyClient } from '@/lib/ably';

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
      }
    }
  })
}

export async function assignTable(tableNumber: number, userId: string) {
  const table = await prisma.table.findUnique({ where: { tableNumber } });
  if (!table) throw new Error("Table not found");

  const assignment = await prisma.$transaction(async (prisma) => {
    const existingAssignment = await prisma.tableUser.findFirst({ where: { userId } });
    if (existingAssignment) {
      await prisma.tableUser.delete({
        where: { userId_tableNumber: { userId, tableNumber: existingAssignment.tableNumber } },
      });
    }
    return await prisma.tableUser.create({ data: { userId, tableNumber } });
  });

  // Publish table assignment to Ably channel
  await ablyClient.channels.get('table-updates').publish('table-assigned', {
    tableNumber,
    userId,
  });

  return assignment;
}
export async function unassignTable(tableNumber: number, userId: string) {
  const table = await prisma.table.findUnique({ where: { tableNumber } });
  if (!table) throw new Error("Table not found");

  const assignment = await prisma.tableUser.findUnique({
    where: { userId_tableNumber: { userId, tableNumber } },
  });

  if (!assignment) throw new Error("User is not assigned to this table");

  await prisma.tableUser.delete({ where: { userId_tableNumber: { userId, tableNumber } } });

  // Publish table unassignment to Ably channel
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
    select: { tableNumber: true },
  });

  return tableUsers.map(tu => tu.tableNumber);
}

export async function assignWaiter(tableNumber: number, waiterId: string) {
  const table = await prisma.table.findUnique({ where: { tableNumber } });
  if (!table) throw new Error("Table not found");

  const updatedTable = await prisma.table.update({
    where: { tableNumber },
    data: { waiterId },
  });

  // Publish waiter assignment to Ably channel
  await ablyClient.channels.get('table-updates').publish('waiter-assigned', {
    tableNumber,
    waiterId,
  });

  return updatedTable;
}

export async function unassignWaiter(tableNumber: number) {
  const table = await prisma.table.findUnique({ where: { tableNumber } });
  if (!table) throw new Error("Table not found");

  const updatedTable = await prisma.table.update({
    where: { tableNumber },
    data: { waiterId: null },
  });

  // Publish waiter unassignment to Ably channel
  await ablyClient.channels.get('table-updates').publish('waiter-unassigned', {
    tableNumber,
  });

  return updatedTable;
}
