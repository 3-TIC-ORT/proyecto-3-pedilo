import React from 'react'
import "./profile.css"
import LogoutButton from '@/components/LogoutButton';

function Profile() {
  return (
    <main>
        <div className="info">
            <img src="media/defaultProfilePicture.svg" alt="profilePicture" />
            <div className="userInfo">
                <div className="textLine">
                    <p>Nombre:</p>
                    <p>ejemplo</p>
                </div>
                <div className="textLine">
                    <p>Email:</p>
                    <p>ejemplo@gmail.com</p>
                </div>
                <div className="textLine">
                    <p>Pedidos:</p>
                    <p>99</p>
                </div>
            </div>
        </div>
        <button>Historial de pedidos</button>
        <LogoutButton />
    </main>
  )
}

export default Profile