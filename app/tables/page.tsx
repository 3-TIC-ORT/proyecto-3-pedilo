import { auth } from '@/auth';
import { getTables, getUserTables, assignTable } from '@/actions/tables'
import TablesClient from './TablesClients'
import { cookies } from 'next/headers'

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
}

async function getInitialData(userId: string | null) {
  const tables = await getTables()
  const userTables = userId ? await getUserTables(userId) : []
  return { tables, userTables }
}

export default async function TablesPage() {
  const session = await auth();
  const cookieStore = cookies()
  const selectedTable = cookieStore.get('selectedTable')

  if (session && session.user) {
    const user: User = {
      ...session.user,
      role: session.user.role || null,
    };
    const userRole = user.role as 'user' | 'waiter' || 'user';
    const initialData = await getInitialData(user.id);

    if (initialData.userTables.length > 0) {
      return (
        <main>
          <h1>Ya tienes una mesa asignada (Mesa {initialData.userTables[0]})</h1>
        </main>
      )
    }

    if (selectedTable) {
      await assignTable(parseInt(selectedTable.value), user.id);
      cookieStore.delete('selectedTable');
      return (
        <main>
          <h1>Se te ha asignado la Mesa {selectedTable.value}</h1>
        </main>
      )
    }

    return (
      <TablesClient
        initialTables={initialData.tables}
        initialUserTables={initialData.userTables}
        currentUser={user}
        userRole={userRole}
        isAuthenticated={true}
      />
    )
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
    )
  }
}