import { auth } from "@/auth";
import { assignTable } from "@/actions/tables";
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { table: string } }
) {
  const session = await auth();
  const table = params.table;
  console.log("table", table);

  if (session) {
    const userId = session.user.id;
    try {
      await assignTable(Number(table), userId);
    } catch (error) {
      console.error("Error assigning table:", error);
      // Even if there's an error, we'll still redirect to the menu
      // The error can be handled on the menu page if necessary
    }
  } else {
    // Set cookie for non-authenticated users
    cookies().set({
      name: 'tableNumber',
      value: table,
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'strict',
      path: '/',
    });
  }

  // Redirect to the menu page in both cases
  return redirect('/menu');
}
