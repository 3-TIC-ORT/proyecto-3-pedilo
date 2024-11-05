"use client";
import React, { useEffect, useState } from 'react';
import "./calls.css";
import { checkAccess } from '@/lib/auth-utils';
import { getWaiterCalls, resolveCall } from '@/actions/calls';
import Ably from 'ably';
import { usePopup } from '@/context/PopupContext';
import { Call } from '@prisma/client';
import { Message } from 'postcss';

interface AblyCallMessage {
  callId: string;
  tableNumber: number;
  reason: string;
  status: string;
  createdAt: Date;
}

const Calls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const { addPopup } = usePopup();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checkAccess('/calls');
    };
    init();

    // Fetch initial calls
    const loadCalls = async () => {
      setIsLoading(true);
      try {
        const initialCalls = await getWaiterCalls();
        console.log(initialCalls);
        setCalls(initialCalls);
      } catch (error) {
        addPopup('Error al cargar las llamadas', true);
      } finally {
        setIsLoading(false);
      }
    };
    loadCalls();

    // Set up real-time updates
    const ably = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY! });
    const channel = ably.channels.get('call-updates');

    const onNewCall = async (message: any) => {
      const newCall = message.data as Call;
      try {
        const initialCalls = await getWaiterCalls();
        console.log(initialCalls);
        setCalls(initialCalls);
      } catch (error) {
        addPopup('Error al cargar las llamadas', true);
      }
    };

    const onCallResolved = async (message: any) => {
      const resolvedCall = message.data as { callId: string };
      try {
        const initialCalls = await getWaiterCalls();
        console.log(initialCalls);
        setCalls(initialCalls);
      } catch (error) {
        addPopup('Error al cargar las llamadas', true);
      }
    };

    channel.subscribe('new-call', onNewCall);
    channel.subscribe('call-resolved', onCallResolved);

    return () => {
      channel.unsubscribe();
      ably.close();
    };
  }, [addPopup]);

  const handleResolve = async (callId: string) => {
    try {
      await resolveCall(callId);
      addPopup('Llamada resuelta exitosamente', false);
    } catch (error) {
      addPopup('Error al resolver la llamada', true);
    }
  };

  const formatTimeAgo = (date: Date) => {
    // You can implement a proper time-ago formatter here
    return new Date(date).toLocaleString();
  };

  // Antes del return, agregamos el ordenamiento
  const sortedCalls = [...calls].sort((a, b) => {
    // Si uno es ready y el otro no, el ready va después
    if (a.status === 'ready' && b.status !== 'ready') return 1;
    if (a.status !== 'ready' && b.status === 'ready') return -1;
    
    // Si ambos son ready, ordenar de más nuevo a más viejo
    if (a.status === 'ready' && b.status === 'ready') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    // Si ninguno es ready, ordenar de más viejo a más nuevo
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  if (isLoading) {
    return (
      <main className='callsMain'>
        <h1>Tus llamados</h1>
        <div className="containerr">
          <p>Cargando tus llamados...</p>
        </div>
      </main>
    );
  }

  return (
    <main className='callsMain'>
      <h1>Tus llamados</h1>
      <section>
        {sortedCalls.map(call => (
          <div key={call.id} className='callCard'>
            <p>Mesa {call.tableNumber}</p>
            <p className="reason">{call.reason}</p>
            <button
              className='callBtn'
              onClick={() => handleResolve(call.id)}
              disabled={call.status === 'resolved'}
            >
              <p>Atendida</p>
            </button>
            <p className='timeAgo'>
              Hace: {formatTimeAgo(call.createdAt)}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Calls;
