import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Fetch all items from the database
    const items = await prisma.item.findMany();

    // Return the items as a JSON response
    return NextResponse.json(items);
  } catch (error) {
    // Handle any errors
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

