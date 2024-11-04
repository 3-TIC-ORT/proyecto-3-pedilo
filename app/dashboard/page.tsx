import React from 'react'
import "./dashboard.css"
import Link from 'next/link'

function Dashboard() {
  return (
    <main className='dashboardMain'>
        <h1>Bienvenido de nuevo, qué estás buscando editar?</h1>
        <p className='p'>A continuación las distintas opciones de cosas a editar.</p>
        <section>
            <Link href="/dashboard/users" className='aLinkBtnDash'>Gestinar usuarios</Link>
            <Link href="/dashboard/menu" className='aLinkBtnDash'>Editar menu</Link>
            <Link href="/dashboard/tables" className='aLinkBtnDash'>Editar mesas</Link>
            <Link href="/dashboard/customize" className='aLinkBtnDash'>Personalizar</Link>
        </section>
    </main>
  )
}

export default Dashboard