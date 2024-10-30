"use server"
import { prisma } from "@/prisma"
import { auth } from '@/auth';
import { Session } from "next-auth";

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

async function getSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('User not authenticated');
  }
  return session;
}

export async function assignTable(tableNumber: number, userId?: string) {
  // Authenticate the user using getSession
  const session = await getSession();
  const user = userId || session.user.id;

  // Ensure `user` is defined
  if (!user) {
    throw new Error("User ID is required.");
  }

  // Check if the requested table exists
  const table = await prisma.table.findUnique({ where: { tableNumber } });
  if (!table) {
    throw new Error("Table not found");
  }

  // Start a transaction to ensure data consistency
  return await prisma.$transaction(async (prisma) => {
    // Check if the user is already assigned to any table
    const existingAssignment = await prisma.tableUser.findFirst({
      where: { userId: user },
    });

    // If an existing assignment is found, remove it
    if (existingAssignment) {
      await prisma.tableUser.delete({
        where: {
          userId_tableNumber: {
            userId: user,
            tableNumber: existingAssignment.tableNumber,
          },
        },
      });
    }

    // Create the new table assignment
    return await prisma.tableUser.create({
      data: {
        userId: user,
        tableNumber,
      },
    });
  });
}

export async function unassignTable(tableNumber: number, userId?: string) {
  const session = await getSession();
  const user = userId || session.user.id;

  const table = await prisma.table.findUnique({ where: { tableNumber } });
  if (!table) {
    throw new Error("Table not found");
  }

  const assignment = await prisma.tableUser.findUnique({
    where: {
      userId_tableNumber: {
        userId: user,
        tableNumber
      }
    }
  });

  if (!assignment) {
    throw new Error("User is not assigned to this table");
  }

  return await prisma.tableUser.delete({
    where: {
      userId_tableNumber: {
        userId: user,
        tableNumber
      }
    },
  });
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
  if (!table) {
    throw new Error("Table not found");
  }

  return await prisma.table.update({
    where: { tableNumber },
    data: { waiterId },
  });
}

export async function unassignWaiter(tableNumber: number) {
  const table = await prisma.table.findUnique({ where: { tableNumber } });
  if (!table) {
    throw new Error("Table not found");
  }

  return await prisma.table.update({
    where: { tableNumber },
    data: { waiterId: null },
  });
}
