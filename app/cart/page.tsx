import React from 'react';
import CartContainer from './CartContainer';
import { checkAccess } from '@/lib/auth-utils';

export default async function Cart() {
  await checkAccess('/cart');
  return <CartContainer />;
}
