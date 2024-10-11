import React from 'react'
import "./profile.css"
import LogoutButton from '@/components/LogoutButton';
import { auth } from '@/auth';
import { getOrders } from '@/actions/order';

export async function Profile() {
  const session = await auth();
  if (!session) {
    return (
      <div>Not authenticated</div>
    )
  } else {
    const user = session.user;
    const orders = await getOrders(user.id);
    return (
      <main>
        <div className="info">
          <img src="media/defaultProfilePicture.svg" alt="profilePicture" />
          {user.image}
          <div className="userInfo">
            <div className="textLine">
              <p>Nombre:</p>
              <p>{user.name}</p>
            </div>
            <div className="textLine">
              <p>Email:</p>
              <p>{user.email}</p>
            </div>
            <div className="textLine">
              <p>Pedidos:</p>
              <p>{orders}</p>
            </div>
          </div>
        </div>
        <button>Historial de pedidos</button>
        <LogoutButton />
      </main>
    )
  }
}

export default Profile
