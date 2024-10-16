import React from 'react'
import "./dashboard.css"

function Dashboard() {
  return (
    <main>
        <h1>Bienvenido de nuevo, qué estás buscando editar?</h1>
        <p className='p'>A continuación las distintas opciones de cosas a editar.</p>
        <section>
            <a href="/dashboard/users">Gestinar usuarios</a>
            <a href="/dashboard/menu">Editar menu</a>
            <a href="/dashboard/tables">Editar mesas</a>
            <a href="/dashboard/customize">Personalizar</a>
        </section>
    </main>
  )
}

export default Dashboard