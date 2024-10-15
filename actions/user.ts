"use server"
import { prisma } from '@/prisma';
import { auth } from '@/auth';
import { Session } from "next-auth";

export async function getUsers(userId?) {
  try {
    if (!userId) {
      return prisma.user.findUnique({
        where: { id: userId },
      });
    } else {
      return prisma.user.findMany({});
    }
  } catch (error) {
    throw new Error("Error fetching users");
  }
}

