"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function newCall(tableNumber: number, reason?: string) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User not authenticated");
    }
    const userId = session?.user.id;
    const waiterId = await prisma.table.findFirst({
      where: { tableNumber },
      select: { waiterId: true }
    });
    const call = prisma.call.create({
      data: {
        waiterId,
        tableNumber,
        userId,
        reason

      }
    });
  } catch (error) {
    console.error("Error creating new call:", error);
    return false;
  }
}

export async function getWaiterCalls() {
  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }
  if (session.user.role !== "waiter") {
    throw new Error("User not authorized");
  }
  const waiterId = session.user.id;
  const calls = await prisma.call.findMany({
    where: { waiterId }
  });

  return calls;

}

export async function resolveCall(callId: number) {
  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }
  if (session.user.role !== "waiter") {
    throw new Error("User not authorized");
  }
  const call = await prisma.call.findUnique({
    where: { callId }
  });
  if (!call) {
    throw new Error("Call not found");
  }
  const resolvedCall = await prisma.call.update({
    where: { callId },
    data: { status: "resoled" }
  });
  return resolvedCall;
}

