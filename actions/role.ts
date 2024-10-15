"use server"
import { prisma } from '@/prisma';
import { auth } from '@/auth';
import { Session } from "next-auth";

export async function changeRole(id: string, role: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error creating new admin:", error);
    throw new Error("Error creating new admin");
  }
}
