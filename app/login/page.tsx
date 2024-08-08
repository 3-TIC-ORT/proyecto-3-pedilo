import React from 'react'
import './login.css'

function Login() {
  
  const restaurantName = 'Ejemplo';

  return (
    <div className="loginContainer">
      <form>
        <h1>Login</h1>
        <div className="input-field">
          <input type="text" name="usermane" placeholder="" required />
          <label htmlFor="userman">Username</label>
        </div>
        <div className="input-field">
          <input type="password" name="password" placeholder="" required />
          <label htmlFor="password">Password</label>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  )
}

export default Login

