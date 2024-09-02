import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth' // Assume this function gets the user session

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getSession(request)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const items = await prisma.cart.findMany({
    where: { userId },
    include: { item: true },
    groupBy: ['itemId'],
    _sum: { amount: true },
  })

  let total = 0
  const formattedItems = items.map((item) => {
    const itemTotal = item.item.price * (item._sum.amount || 0)
    total += itemTotal
    return {
      ...item,
      amount: item._sum.amount,
      total: formatUSD(itemTotal),
      price: formatUSD(item.item.price),
    }
  })

  return NextResponse.json({ items: formattedItems, total: formatUSD(total) })
}

export async function POST(request: Request) {
  const session = await getSession(request)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const { itemId } = await request.json()

  const item = await prisma.item.findUnique({ where: { id: itemId } })
  if (!item) {
    return NextResponse.json({ error: 'Invalid item' }, { status: 400 })
  }

  const cartItem = await prisma.cart.findFirst({
    where: { userId, itemId },
  })

  if (cartItem) {
    await prisma.cart.update({
      where: { id: cartItem.id },
      data: { amount: { increment: 1 } },
    })
  } else {
    await prisma.cart.create({
      data: { itemId, userId, amount: 1 },
    })
  }

  return NextResponse.json({ message: 'Item added to cart' })
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
