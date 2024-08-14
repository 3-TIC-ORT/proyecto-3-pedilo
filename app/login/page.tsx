"use client";
import React from 'react'
import './login.css'

function Login() {
  
  const restaurantName = 'Ejemplo';

  return (
    <form className="masterContainer form">
      <h1 className='headH1'>Login</h1>
      <div className="input-field">
        <input type="text" name="email" placeholder="" required />
        <label htmlFor="email">Email</label>
      </div>
      <div className="input-field">
        <input type="password" name="password" placeholder="" required />
        <label htmlFor="password">Password</label>
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
  )
}

export default Login
