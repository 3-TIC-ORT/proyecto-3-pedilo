import React from 'react'
import "./orders.css"

function Orders() {
  return (
    <main>
        <h1>Tus ordenes</h1>
        <div className="orders">
            <section>
                <div className="textRow">
                    <div className="textRow">
                        <p>Mesa N°</p>
                        <p>99</p>
                    </div>
                    <div className="textRow">
                        <p>Orden</p>
                        <p>#9999</p>
                    </div>
                </div>
                <div className="orderNotes">
                    <p>Notas:</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quam in dolor assumenda nam veritatis. Eligendi id rerum tempore? Quae provident hic qui quis porro doloribus officiis optio autem quos!</p>
                </div>
                <div className="orderItems">
                    <div className="textRow">
                        <p>Productos:</p>
                        <div className="textRow">
                            <p>Total:</p>
                            <p>$99.999</p>
                        </div>
                    </div>
                    <div className="itemsContainer">
                        <div className="item">
                            <div className="itemRow">
                                <p>Item de ejemplo</p>
                                <p>99x</p>
                            </div>
                            <div className="itemPrice">
                                <p>$99.999</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="orderState">
                    <p>Estado:</p>
                    <p>En preparación</p>
                </div>
                <div className="orderDetails">
                    13/10/2024 15:00
                </div>
            </section>
        </div>
    </main>
  )
}

export default Orders