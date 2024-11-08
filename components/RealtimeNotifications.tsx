'use client';
import React, { useEffect } from 'react';
import Ably from 'ably';
import { usePopup } from '@/context/PopupContext';

interface RealtimeNotificationsProps {
  userRole?: string | null
  tablesWaiter: number[]
}

interface Message {
  data: Record<string, any>;
}
const RealtimeNotifications: React.FC<RealtimeNotificationsProps> = ({ userRole, tablesWaiter }) => {
  const { addPopup } = usePopup();

  useEffect(() => {
    if (userRole !== 'waiter') return;

    const ably = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY! });
    const channel = ably.channels.get('call-updates');

    const onNewCall = (message: any) => {
      const call = message.data as {
        tableNumber: number;
        reason: string;
      };


      if (tablesWaiter.includes(call.tableNumber)) {

        // Show popup notification
        addPopup(`Nueva llamada de la Mesa ${call.tableNumber}: ${call.reason}`, false);

        // Optional: Also show system notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Nueva llamada', {
            body: `Mesa ${call.tableNumber} necesita asistencia\nRazón: ${call.reason}`,
          });
        }
      }
    };

    // Subscribe to new calls
    channel.subscribe('new-call', onNewCall);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      channel.unsubscribe('new-call', onNewCall);
      ably.close();
    };
  }, [userRole, addPopup]);

  return null;
};

export default RealtimeNotifications;

