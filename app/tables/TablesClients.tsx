'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { assignTable, unassignTable, assignWaiter, unassignWaiter, getTableUsers } from '@/actions/tables';
import { Realtime } from 'ably';
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

export default function TablesClient({ initialTables, initialUserTables, currentUser, userRole, isAuthenticated }: TablesClientProps) {
  const [tables, setTables] = useState(initialTables);
  const [userTables, setUserTables] = useState(initialUserTables);
  const [showPopup, setShowPopup] = useState(false);
  const [popupClass, setPopupClass] = useState('popup');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupCount, setPopupCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const ably = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });

    const channel = ably.channels.get('table-updates');

    // Subscribe to table assignment
    channel.subscribe('table-assigned', (message) => {
      const { tableNumber, userId } = message.data;

      // Define a new TableUser object with required properties
      const newUser: TableUser = {
        id: `${tableNumber}-${userId}`, // Placeholder unique ID
        userId,
        tableNumber,
        createdAt: new Date(), // Placeholder date
        updatedAt: new Date(), // Placeholder date
        User: {
          id: userId,
          name: null,  // Placeholder value
          email: ''    // Placeholder value
        }
      };

      setTables((prevTables) =>
        prevTables.map((t) =>
          t.tableNumber === tableNumber
            ? { ...t, Waiter: t.Waiter?.id === currentUser!.id ? null : currentUser as Waiter }
            : t
        )
      );
    });

    // Subscribe to table unassignment
    channel.subscribe('table-unassigned', (message) => {
      const { tableNumber, userId } = message.data;

      setTables((prevTables) =>
        prevTables.map((table) =>
          table.tableNumber === tableNumber
            ? { ...table, Users: table.Users.filter(user => user.userId !== userId) }
            : table
        )
      );
    });

    // Cleanup Ably connection on component unmount
    return () => {
      channel.unsubscribe();
      ably.close();
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showPopup) {
      timer = setTimeout(() => {
        setPopupClass('popup-exit');
        setTimeout(() => {
          setShowPopup(false);
          setPopupCount(0);
        }, 500);
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [showPopup]);

  const showPopupMessage = (message: string) => {
    setPopupMessage(message);
    setPopupCount(prev => prev + 1);
    setShowPopup(true);
    setPopupClass('popup');
  };

  const handleTableClick = async (tableNumber: number) => {
    try {
      if (userRole === 'user') {
        if (isAuthenticated) {
          const table = tables.find(t => t.tableNumber === tableNumber);
          if (table && table.Users.length >= 99) {
            showPopupMessage(`Mesa ${tableNumber} ya tiene 99 usuarios.`);
            return;
          }
          if (userTables.includes(tableNumber)) {
            await unassignTable(tableNumber, currentUser!.id);
            setUserTables(userTables.filter(t => t !== tableNumber));
            showPopupMessage(`Mesa ${tableNumber} desasignada.`);
          } else {
            await assignTable(tableNumber, currentUser!.id);
            setUserTables([...userTables, tableNumber]);
            showPopupMessage(`Mesa ${tableNumber} asignada.`);
            setTimeout(() => router.push('/'), 1500);
          }
        } else {
          sessionStorage.setItem('selectedTable', tableNumber.toString());
          localStorage.setItem('selectedTable', tableNumber.toString());

          showPopupMessage(`Mesa ${tableNumber} seleccionada. Por favor, inicia sesión para continuar.`);
          setTimeout(() => router.push('/login'), 1500);
        }
      } else if (userRole === 'waiter' && isAuthenticated) {
        const table = tables.find(t => t.tableNumber === tableNumber);
        if (table?.Waiter?.id === currentUser!.id) {
          await unassignWaiter(tableNumber);
          showPopupMessage(`Mesa ${tableNumber} desasignada.`);
        } else {
          await assignWaiter(tableNumber, currentUser!.id);
          showPopupMessage(`Mesa ${tableNumber} asignada.`);
        }
        setTables(tables.map(t =>
          t.tableNumber === tableNumber
            ? { ...t, Waiter: t.Waiter?.id === currentUser!.id ? null : currentUser as Waiter }
            : t
        ));
      }
    } catch (error) {
      console.error('Error al manejar el clic en la mesa:', error);
      showPopupMessage('Ocurrió un error. Por favor, intente nuevamente.');
    }
  };

  const handleUnassignAllUsers = async (tableNumber: number) => {
    try {
      const tableUsers = await getTableUsers(tableNumber);
      for (const tableUser of tableUsers) {
        await unassignTable(tableNumber, tableUser.userId);
      }
      setTables(tables.map(t =>
        t.tableNumber === tableNumber
          ? { ...t, Users: [] }
          : t
      ));
      showPopupMessage(`Todos los usuarios de la Mesa ${tableNumber} han sido desasignados.`);
    } catch (error) {
      console.error('Error al desasignar todos los usuarios de la mesa:', error);
      showPopupMessage('Ocurrió un error. Por favor, intente nuevamente.');
    }
  };

  const sortedTables = useMemo(() => {
    if (userRole === 'user') {
      return [...tables].sort((a, b) => a.tableNumber - b.tableNumber);
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
    <main>
      <h1>Por favor selecciona una mesa {userRole === 'user' ? 'disponible' : 'para atender'}.</h1>
      <section>
        {sortedTables.map((table) => (
          <React.Fragment key={table.tableNumber}>
            {userRole === 'user' ? (
              <button
                className="tableBtn"
                onClick={() => handleTableClick(table.tableNumber)}
                disabled={isAuthenticated && table.Users.length >= 99 && !userTables.includes(table.tableNumber)}
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
      {showPopup && (
        <div className={popupClass} onClick={() => setPopupCount(prev => prev + 1)}>
          {popupMessage} ({popupCount})
        </div>
      )}
    </main>
  );
}
