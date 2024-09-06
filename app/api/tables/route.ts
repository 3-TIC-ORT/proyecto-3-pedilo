import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { isAuthenticated } from '@/lib/auth';

const prisma = new PrismaClient();

// Fetch all tables (GET request)
export async function GET(req: NextRequest) {
  try {
    const tables = await prisma.table.findMany();
    return NextResponse.json(tables);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Assign a table to a user (POST request)
export async function POST(req: NextRequest) {
  try {
    const { tableNumber } = await req.json();
    const session = await isAuthenticated(req);
    const user = session?.user;
    const authenticated = session?.isAuthenticated;


    // Ensure both tableNumber and userId are provided
    if (!tableNumber) {
      return NextResponse.json({ error: "Table number is required" }, { status: 400 });
    }
    if (!authenticated) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    // Check if the table exists
    const table = await prisma.table.findUnique({ where: { tableNumber } });
    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // Check if the table is already assigned to a user
    if (table.userId) {
      return NextResponse.json({ error: "Table is already assigned to another user" }, { status: 400 });
    }

    // Assign the user to the table
    const updatedTable = await prisma.table.update({
      where: { tableNumber },
      data: { userId: user },
    });

    return NextResponse.json(updatedTable);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Unassign a user from a table (DELETE request)
export async function DELETE(req: NextRequest) {
  try {
    const { tableNumber } = await req.json();
    const session = await isAuthenticated(req);
    const user = session?.user;
    const authenticated = session?.isAuthenticated;

    // Ensure tableNumber is provided
    if (!tableNumber) {
      return NextResponse.json({ error: "Table number is required" }, { status: 400 });
    }
    if (!authenticated) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Check if the table exists
    const table = await prisma.table.findUnique({ where: { tableNumber } });
    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // Check if the table has a user assigned
    if (!table.userId) {
      return NextResponse.json({ error: "No user assigned to this table" }, { status: 400 });
    }

    // Unassign the user from the table
    const updatedTable = await prisma.table.update({
      where: { tableNumber },
      data: { userId: null },
    });

    return NextResponse.json(updatedTable);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


