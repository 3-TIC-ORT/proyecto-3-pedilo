import React from 'react'
import './login.css'

function Login() {
  
  const restaurantName = 'Ejemplo';

  return (
    <div className="loginContainer">
      <form>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  )
}

export default Login

