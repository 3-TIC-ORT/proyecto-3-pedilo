import React from 'react'
import "./profile.css"
import LogoutButton from '@/components/LogoutButton';
import { auth } from '@/auth';
import { getOrders } from '@/actions/order';
import Link from 'next/link';

export default async function Profile() {
  const session = await auth();
  if (!session) {
    return (
      <main>Not authenticated</main>
    )
  } else {
    const user = session.user;
    const orders = await getOrders(user.id);
    console.log("orders: " + orders);
    
    return (
      <main className='profileMain'>
        <div className="info">
            <img src={user.image ? user.image : "media/defaultProfilePicture.svg"} alt="profilePicture" />
            <div className="userInfo">
                {user.name && (
                    <div className="textLine">
                        <p>Nombre:</p>
                        <p>{user.name}</p>
                    </div>
                )}
                <div className="textLine">
                    <p>Email:</p>
                    <p>{user.email}</p>
                </div>
                <div className="textLine">
                    <p>Pedidos:</p>
                    <p>{orders.length}</p>
                </div>
            </div>
        </div>
        <a href={`/orders`} className='viewOrdersBtn'>Tus ordenes</a>
        <a href={`/tables`} className='viewOrdersBtn'>Cambiar de mesa</a>
        <LogoutButton />
      </main>
    )
  }
}

