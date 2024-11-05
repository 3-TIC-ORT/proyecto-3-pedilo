import React from 'react';
import OrdersComponent from './OrdersComponent';
import { checkAccess } from '@/lib/auth-utils';

export default async function OrdersPage() {
  await checkAccess('/orders');

  return <OrdersComponent />;
}

