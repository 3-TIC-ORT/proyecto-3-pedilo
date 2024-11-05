"use client"
import React, { useState } from 'react'
import "./calls.css"
import { checkAccess } from '@/lib/auth-utils';

async function Calls() {
  await checkAccess('/calls');

  return (
    <main className='callsMain'>
      <h1>Tus llamados</h1>
      <section>
        <div className='callCard'>
          <p>Mesa 99</p>
          <p className="reazon">Expedita architecto, nemo qui ducimus praesentium quis exercitationem mollitia.</p>
          <button className='callBtn'>
            <p>Atendida</p>
          </button>
          <p className='timeAgo'>Hace: 59:59:59</p>
        </div>
      </section>
    </main>
  )
}

export default Calls
