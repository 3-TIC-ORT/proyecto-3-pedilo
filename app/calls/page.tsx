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

  useEffect(() => {
    const init = async () => {
      await checkAccess('/calls');
    };
    init();

    // Fetch initial calls
    const loadCalls = async () => {
      try {
        const initialCalls = await getWaiterCalls();
        setCalls(initialCalls);
      } catch (error) {
        addPopup('Error al cargar las llamadas', true);
      }
    };
    loadCalls();

    // Set up real-time updates
    const ably = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY! });
    const channel = ably.channels.get('call-updates');

    const onNewCall = (message: any) => {
      const newCall = message.data as Call;
      setCalls(prev => [newCall, ...prev]);
    };

    const onCallResolved = (message: any) => {
      const resolvedCall = message.data as { callId: string };
      setCalls(prev => prev.filter(call => call.id !== resolvedCall.callId));
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

  return (
    <main className='callsMain'>
      <h1>Tus llamados</h1>
      <section>
        {calls.map(call => (
          <div key={call.id} className='callCard'>
            <p>Mesa {call.tableNumber}</p>
            <p className="reason">{call.reason}</p>
            <button
              className='callBtn'
              onClick={() => handleResolve(call.id)}
            >
              <p>Atendida</p>
            </button>
            <p className='timeAgo'>
              Hace: {formatTimeAgo(call.createdAt)}
            </p>
          </div>
        ))}
        {calls.length === 0 && (
          <p>No hay llamados activos</p>
        )}
      </section>
    </main>
  );
}

export default Calls;
