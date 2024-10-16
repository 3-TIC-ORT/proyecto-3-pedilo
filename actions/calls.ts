"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function newCall(tableNumber: number, waiterId: string, reason: string) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    // Fetch waiterId for the given tableNumber

    // Create the new call with waiterId, tableNumber, userId, and reason
    const call = await prisma.call.create({
      data: {
        waiterId,
        tableNumber,
        userId,
        reason // reason is optional (string or undefined)
      }
    });

    return call; // Return the created call object
  } catch (error) {
    console.error("Error creating new call:", error);
    return false; // Return false if there is an error
  }
}

export async function getWaiterCalls() {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User not authenticated");
    }

    if (session.user.role !== "waiter") {
      throw new Error("User not authorized");
    }

    const waiterId = session.user.id;

    // Fetch all calls for the waiter
    const calls = await prisma.call.findMany({
      where: { waiterId }
    });

    return calls; // Return the list of calls
  } catch (error) {
    console.error("Error fetching waiter calls:", error);
    throw new Error("Failed to fetch waiter calls"); // Return a meaningful error message
  }
}

export async function resolveCall(id: string) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User not authenticated");
    }

    if (session.user.role !== "waiter") {
      throw new Error("User not authorized");
    }

    // Find the call by its ID
    const call = await prisma.call.findUnique({
      where: { id }
    });

    if (!call) {
      throw new Error("Call not found");
    }

    // Update the call's status to "resolved"
    const resolvedCall = await prisma.call.update({
      where: { id },
      data: { status: "resolved" } // Fix typo from "resoled" to "resolved"
    });

    return resolvedCall; // Return the updated call
  } catch (error) {
    console.error("Error resolving call:", error);
    throw new Error("Failed to resolve call"); // Return a meaningful error message
  }
}

