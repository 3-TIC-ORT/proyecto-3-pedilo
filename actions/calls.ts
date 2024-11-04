"use server"
import { ablyClient } from "@/lib/ably";  // Import Ably client
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Call } from "@prisma/client";

export async function newCall(tableNumber: number, reason: string): Promise<Call | false> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Get waiter ID for the table
    const tableData = await prisma.table.findUnique({
      where: { tableNumber },
      select: { waiterId: true }
    });

    if (!tableData?.waiterId) {
      throw new Error("No waiter assigned to this table");
    }

    // Create the new call
    const call = await prisma.call.create({
      data: {
        waiterId: tableData.waiterId,
        tableNumber,
        userId: session.user.id,
        reason: reason, // Make sure reason can be null if undefined
        status: "pending" // Add status if it's part of your Call model
      }
    });

    // Publish to Ably
    await ablyClient.channels.get("call-updates").publish("new-call", {
      callId: call.id,
      waiterId: call.waiterId,
      tableNumber: call.tableNumber,
      userId: call.userId,
      reason: call.reason,
      status: call.status,
      createdAt: call.createdAt
    });

    return call;

  } catch (error) {
    console.error("Error creating new call:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    return false;
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

export async function hasPendingCall(tableNumber: number) {
  try {
    const pendingCall = await prisma.call.findFirst({
      where: {
        tableNumber,
        status: "pending"
      }
    });
    return !!pendingCall; // Return true if there is a pending call, false otherwise
  } catch (error) {
    console.error("Error checking pending call:", error);
    throw new Error("Failed to check pending call");
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
      data: { status: "resolved" }
    });

    // Publish to Ably that the call was resolved
    await ablyClient.channels.get("call-updates").publish("call-resolved", {
      callId: resolvedCall.id,
      tableNumber: resolvedCall.tableNumber,
      status: "resolved"
    });

    return resolvedCall;
  } catch (error) {
    console.error("Error resolving call:", error);
    throw new Error("Failed to resolve call");
  }
}

