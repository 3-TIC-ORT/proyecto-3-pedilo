"use server"
import { prisma } from "@/prisma"
import { auth } from "@/auth"

export async function getTables() {
  return await prisma.table.findMany()
}
export async function assignTable(tableNumber: number, userId: string) {
  const table = await prisma.table.findUnique({ where: { tableNumber } });
  if (!table) {
    throw new Error("Table not found")
  }
  if (table.userId) {
    throw new Error("Table is already assigned to another user")
  }
  return await prisma.table.update({
    where: { tableNumber },
    data: { userId },
  });

}
export async function unassignTable(tableNumber: number) {
  const table = await prisma.table.findUnique({ where: { tableNumber } });
  if (!table) {
    throw new Error("Table not found")
  }
  return await prisma.table.update({
    where: { tableNumber },
    data: { userId: null },
  });
}

