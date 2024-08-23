import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest,) {
  try {
    // Fetch all tables from the database
    const tables = await prisma.table.findMany();
    // Return the items as a JSON response
    return NextResponse.json(tables);
  } catch (error) {
    // Handle any errors
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}