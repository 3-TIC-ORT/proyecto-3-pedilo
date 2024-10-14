"use server"
import { prisma } from "@/prisma"

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
  if (!table) {
    throw new Error("Table not found")
  }

  // Check if the user is already assigned to this table
  const existingAssignment = await prisma.tableUser.findUnique({
    where: {
      userId_tableNumber: {
        userId,
        tableNumber
      }
    }
  });

  if (existingAssignment) {
    throw new Error("User is already assigned to this table")
  }

  return await prisma.tableUser.create({
    data: {
      userId,
      tableNumber
    },
  });
}

export async function unassignTable(tableNumber: number, userId: string) {
  const table = await prisma.table.findUnique({ where: { tableNumber } });
  if (!table) {
    throw new Error("Table not found")
  }

  const assignment = await prisma.tableUser.findUnique({
    where: {
      userId_tableNumber: {
        userId,
        tableNumber
      }
    }
  });

  if (!assignment) {
    throw new Error("User is not assigned to this table")
  }

  return await prisma.tableUser.delete({
    where: {
      userId_tableNumber: {
        userId,
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
