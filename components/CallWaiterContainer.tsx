// components/CallWaiterContainer.tsx
import { getUserTables } from '@/actions/tables';
import CallWaiterBtn from './CallWaiterBtn';
import { Table } from '@prisma/client';
import { auth } from "@/auth";

export default async function CallWaiterContainer() {
  const session = await auth();
  const userId = session?.user?.id;
  const userTables = await getUserTables(userId);
  const tableNumber = userTables[0].tableNumber;
  return <CallWaiterBtn tableNumber={tableNumber} />;
}

