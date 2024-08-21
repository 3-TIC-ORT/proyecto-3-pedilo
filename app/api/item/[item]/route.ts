import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { item: String } }
) {
  const item = params.item;
  console.log(item);
  try {
    // Fetch specific item from the database
    const data = await prisma.item.findUnique({
      where: {
        id: Number(item),
      },
    });
    if (!data) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    console.log(data);

    // Return the items as a JSON response
    return NextResponse.json(data);
  } catch (error) {
    // Handle any errors
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


