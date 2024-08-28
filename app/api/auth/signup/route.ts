import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(request: Request) {
  const { email, password, name, surname } = await request.json();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await hash(password, 10);

  // Create a new user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name,
      surname: surname,
    },
  });

  return NextResponse.json(user, { status: 201 });
}

