import { getTables, getUserTables, assignTable, unassignTable } from '@/actions/tables';
import TablesClient from './TablesClients';
import { auth } from "@/auth";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
}

async function getInitialData(userId: string | null) {
  const tables = await getTables();
  const userTables = userId ? await getUserTables(userId) : [];
  return { tables, userTables };
}

export default async function TablesPage() {
  const session = await auth();
  let selectedTable: string | null = null;

  if (typeof window !== 'undefined') {
    selectedTable = localStorage.getItem('selectedTable');
  }

  if (session && session.user) {
    const user: User = {
      ...session.user,
      role: session.user.role || null,
    };
    const userRole = user.role as 'user' | 'waiter' || 'user';
    const initialData = await getInitialData(user.id);

    // Unassign user from their current table if they have one
    if (initialData.userTables.length > 0) {
      await unassignTable(initialData.userTables[0].tableNumber, user.id);
    }

    if (selectedTable) {
      await assignTable(parseInt(selectedTable), user.id);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedTable');
      }
      return (
        <main>
          <h1>Se te ha asignado la Mesa {selectedTable}</h1>
        </main>
      );
    }

    return (
      <TablesClient
        initialTables={initialData.tables}
        initialUserTables={[]}
        currentUser={user}
        userRole={userRole}
        isAuthenticated={true}
      />
    );
  } else {
    const initialData = await getInitialData(null);
    return (
      <TablesClient
        initialTables={initialData.tables}
        initialUserTables={[]}
        currentUser={null}
        userRole="user"
        isAuthenticated={false}
      />
    );
  }
}
