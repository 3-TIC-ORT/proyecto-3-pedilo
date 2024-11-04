import React from 'react'
import "./dashboard.css"
import Link from 'next/link'

function Dashboard() {
  return (
    <main className='dashboardMain'>
        <h1>Bienvenido de nuevo, qué estás buscando editar?</h1>
        <p className='p'>A continuación las distintas opciones de cosas a editar.</p>
        <section>
            <a href="/dashboard/users" className='aLinkBtnDash'>Gestinar usuarios</a>
            <a href="/dashboard/menu" className='aLinkBtnDash'>Editar menu</a>
            <a href="/dashboard/tables" className='aLinkBtnDash'>Editar mesas</a>
            <a href="/dashboard/customize" className='aLinkBtnDash'>Personalizar</a>
        </section>
    </main>
  )
}

export default Dashboard