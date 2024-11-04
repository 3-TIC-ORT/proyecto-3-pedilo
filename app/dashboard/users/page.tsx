import React from 'react'
import "./users.css"

function Users() {
  return (
    <main className='dashboardUsersMain'>
        <h1>Gestion de usuarios</h1>
        <section>
            <input type="search" name="searchField" id="searchField" placeholder='Buscar usuarios'/>
            <div className="usersContainer">
                <div className="usersCategory">
                    <h2>Administradores</h2>
                    <div className="cardsContainer">
                        <div className="card">
                            <div className="data">
                                <div className="textRow">
                                    <p>Nombre:</p>
                                    <p>Ejemplo</p>
                                </div>
                                <div className="textRow">
                                    <p>Email:</p>
                                    <p>sample@sample.com</p>
                                </div>
                            </div>
                            <button><img src="/media/crossIcon.svg" alt="" /></button>
                        </div>
                    </div>
                </div>
                <div className="usersCategory">
                    <h2>Cocineros</h2>
                    <div className="cardsContainer">
                        <div className="card">
                            <div className="data">
                                <div className="textRow">
                                    <p>Nombre:</p>
                                    <p>Ejemplo</p>
                                </div>
                                <div className="textRow">
                                    <p>Email:</p>
                                    <p>sample@sample.com</p>
                                </div>
                            </div>
                            <button><img src="/media/crossIcon.svg" alt="" /></button>
                        </div>
                    </div>
                </div>
                <div className="usersCategory">
                    <h2>Mozos</h2>
                    <div className="cardsContainer">
                        <div className="card">
                            <div className="data">
                                <div className="textRow">
                                    <p>Nombre:</p>
                                    <p>Ejemplo</p>
                                </div>
                                <div className="textRow">
                                    <p>Email:</p>
                                    <p>sample@sample.com</p>
                                </div>
                            </div>
                            <button><img src="/media/crossIcon.svg" alt="" /></button>
                        </div>
                    </div>
                </div>
                <div className="usersCategory">
                    <h2>Usuarios</h2>
                    <div className="cardsContainer">
                        <div className="card">
                            <div className="data">
                                <div className="textRow">
                                    <p>Nombre:</p>
                                    <p>Ejemplo</p>
                                </div>
                                <div className="textRow">
                                    <p>Email:</p>
                                    <p>sample@sample.com</p>
                                </div>
                            </div>
                            <button><img src="/media/crossIcon.svg" alt="" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
  )
}

export default Users