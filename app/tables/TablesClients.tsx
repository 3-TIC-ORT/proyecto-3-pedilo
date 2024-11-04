'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTables, assignTable, unassignTable, assignWaiter, unassignWaiter, getTableUsers } from '@/actions/tables';
import * as Ably from 'ably';
import { usePopup } from '@/context/PopupContext';
import "./tables.css";

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Waiter {
  id: string;
  name: string | null;
  email: string;
}

interface TableUser {
  id: string;
  userId: string;
  tableNumber: number;
  createdAt: Date;
  updatedAt: Date;
  User: User;
}

interface Table {
  tableNumber: number;
  Users: TableUser[];
  Waiter: Waiter | null;
}

interface TablesClientProps {
  initialTables: Table[];
  initialUserTables: number[];
  currentUser: User | null;
  userRole: 'user' | 'waiter';
  isAuthenticated: boolean;
}

export default function TablesClient({
  initialTables,
  initialUserTables,
  currentUser,
  userRole,
  isAuthenticated
}: TablesClientProps) {
  const [tables, setTables] = useState(initialTables);
  const [userTables, setUserTables] = useState(initialUserTables);
  const router = useRouter();
  const { addPopup } = usePopup();

  const fetchTables = async () => {
    try {
      const updatedTables = await getTables();
      setTables(updatedTables);
    } catch (error) {
      console.error('Error fetching tables:', error);
      addPopup('Ocurrio un errror al obtener las mesas', true);
    }
  };

  // Initialize Ably client
  useEffect(() => {
    let ably: Ably.Realtime | null = null;
    let channel: Ably.RealtimeChannel | null = null;

    const setupAbly = async () => {
      try {
        ably = new Ably.Realtime({
          key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
          clientId: currentUser?.id || 'anonymous'
        });

        channel = ably.channels.get('table-updates');

        // Handle table assignments
        channel.subscribe('table-assigned', async (message) => {
          const { tableNumber, userId } = message.data;
          await fetchTables();
          if (currentUser?.id === userId) {
            setUserTables(prev => [...prev, tableNumber]);
          }
        });

        // Handle table unassignments
        channel.subscribe('table-unassigned', async (message) => {
          const { tableNumber, userId } = message.data;
          await fetchTables();
          if (currentUser?.id === userId) {
            setUserTables(prev => prev.filter(t => t !== tableNumber));
          }
        });

        // Handle waiter assignments
        channel.subscribe('waiter-assigned', async (message) => {
          const { tableNumber, waiterId } = message.data;
          if (userRole === 'waiter') {
            await fetchTables();
          }
        });

        // Handle waiter unassignments
        channel.subscribe('waiter-unassigned', async (message) => {
          const { tableNumber } = message.data;
          if (userRole === 'waiter') {
            await fetchTables();
          }
        });

        // Handle connection state
        ably.connection.on('connected', () => {
          console.log('Connected to Ably');
        });

        ably.connection.on('failed', () => {
          console.error('Failed to connect to Ably');
        });
      } catch (error) {
        console.error('Error setting up Ably:', error);
      }
    };

    setupAbly();

    // Cleanup function
    return () => {
      if (channel) {
        channel.unsubscribe();
      }
      if (ably) {
        ably.close();
      }
    };
  }, [currentUser?.id, userRole]);


  const handleTableClick = async (tableNumber: number) => {
    
    try {
      if (userRole === 'user') {
        if (isAuthenticated) {
          const table = tables.find(t => t.tableNumber === tableNumber);
          if (table && table.Users.length >= 99) {
            addPopup('Esta mesa esta ocupada por muchos usuarios', true);
            return;
          } else {
            await assignTable(tableNumber, currentUser!.id);
            setUserTables([...userTables, tableNumber]);
            setTimeout(() => router.push('/menu'), 1000);
            addPopup(`Haz seleccionado la mesa ${tableNumber} . Te estaremos redirigiendo al menu.`, false);
          }
        } else {
          sessionStorage.setItem('selectedTable', tableNumber.toString());
          localStorage.setItem('selectedTable', tableNumber.toString());
          setTimeout(() => router.push('/login'), 1000);
          addPopup(`Haz seleccionado la mesa ${tableNumber} . Te estaremos redirigiendo al inicio.`, true);
        }
      } else if (userRole === 'waiter' && isAuthenticated) {
        const table = tables.find(t => t.tableNumber === tableNumber);
        if (table?.Waiter?.id === currentUser!.id) {
          await unassignWaiter(tableNumber);
          addPopup(`Dejaste de atender la mesa ${tableNumber}.`, false);
        } else {
          await assignWaiter(tableNumber, currentUser!.id);
          addPopup(`Estas atendiendo la mesa ${tableNumber}.`, false);
        }
      }
    } catch (error) {
      console.error('Error al manejar el clic en la mesa:', error);
      addPopup('Ocurrio un errror al seleccionar la mesa', true);
    }
  };

  const handleUnassignAllUsers = async (tableNumber: number) => {
    try {
      const tableUsers = await getTableUsers(tableNumber);
      for (const tableUser of tableUsers) {
        await unassignTable(tableNumber, tableUser.userId);
      }
      addPopup(`Se a liberado la mesa ${tableNumber}`, false);
    } catch (error) {
      console.error('Error al desasignar todos los usuarios de la mesa:', error);
      addPopup('Ocurrio un errror al liberar la mesa', true);
    }
  };

  const sortedTables = useMemo(() => {
    if (userRole === 'user') {
      return [...tables].sort((a, b) => {
        const aDisabled = !a.Waiter || a.Users.length >= 99;
        const bDisabled = !b.Waiter || b.Users.length >= 99;

        if (aDisabled && !bDisabled) return 1;
        if (!aDisabled && bDisabled) return -1;
        return a.tableNumber - b.tableNumber;
      });
    } else {
      return [...tables].sort((a, b) => {
        const aAssigned = a.Waiter?.id === currentUser?.id;
        const bAssigned = b.Waiter?.id === currentUser?.id;
        const aAvailable = !a.Waiter;
        const bAvailable = !b.Waiter;

        if (aAssigned && !bAssigned) return -1;
        if (!aAssigned && bAssigned) return 1;
        if (aAvailable && !bAvailable) return -1;
        if (!aAvailable && bAvailable) return 1;
        return a.tableNumber - b.tableNumber;
      });
    }
  }, [tables, userRole, currentUser?.id]);

  return (
    <main className='tablesMain'>
      <h1>Por favor selecciona una mesa {userRole === 'user' ? 'disponible' : 'para atender'}.</h1>
      <section className='tablesSectionContainer'>
        {sortedTables.map((table) => (
          <React.Fragment key={table.tableNumber}>
            {userRole === 'user' ? (
              <button
                className="tableBtn"
                onClick={() => handleTableClick(table.tableNumber)}
                disabled={isAuthenticated && (table.Users.length >= 99 || !table.Waiter) && !userTables.includes(table.tableNumber)}
              >
                <p>Mesa {table.tableNumber}</p>
                {userTables.includes(table.tableNumber) && <p>(Seleccionada)</p>}
              </button>
            ) : (
              <label className="waiter-checkbox">
                <input
                  type="checkbox"
                  checked={table.Waiter?.id === currentUser?.id}
                  onChange={() => handleTableClick(table.tableNumber)}
                  disabled={!!(table.Waiter && table.Waiter.id !== currentUser?.id)}
                />
                Mesa {table.tableNumber}
                {table.Waiter && table.Waiter.id !== currentUser?.id && (
                  <p>(Asignada a otro camarero)</p>
                )}
                {table.Users.length > 0 && (
                  <button onClick={() => handleUnassignAllUsers(table.tableNumber)}>
                    Liberar mesa
                  </button>
                )}
              </label>
            )}
          </React.Fragment>
        ))}
      </section>
    </main>
  );
}
