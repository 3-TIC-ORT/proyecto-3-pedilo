"use client";
import React from 'react'
import './orders.css'
import { useState } from 'react';

function page() {
    const [selectedState, setSelectedState] = useState("waiting");
    const handleRadioChange = (e) => {
        setSelectedState(e.target.id);
    };
    
  return (
    <div className='masterContainer container'> 
      <h1 className='headH1'>Ordenes (Mozo)</h1>
      <div className="orders">
        <div className="order">
            <div className="orderHeader">
                <div className="orderTitle">
                    <h2>Mesa 1</h2>-<p>Orden #1</p>
                </div>
                <div className="closeOrderBtnContainer">
                    <div className="closeOrderBtn"></div>
                </div>
            </div>
            <div className="orderBody">
                <div className="orderItems">
                    <div className="orderItem">
                        <p>1x Hamburguesa</p>
                        <p>$120</p>
                    </div>
                    <div className="orderItem">
                        <p>1x Papas</p>
                        <p>$50</p>
                    </div>
                    <div className="orderItem">
                        <p>1x Refresco</p>
                        <p>$30</p>
                    </div>
                    <div className="orderTotal">
                        <p>Total:</p><h2>$200</h2>
                    </div>
                </div>
                <div className="orderStateContainer">
                    <h3>Estado:</h3>
                    <div className={`orderState ${selectedState}`}>
                        <div className="orderStateRadio">
                            <input type="radio" name="orderState" id="waiting" onChange={handleRadioChange} checked={selectedState === "waiting"}/>
                            <label htmlFor="waiting">En espera</label>
                        </div>
                        <div className="orderStateRadio">
                            <input type="radio" name="orderState" id="cooking" onChange={handleRadioChange} checked={selectedState === "cooking"}/>
                            <label htmlFor="cooking">En preparación</label>
                        </div>
                        <div className="orderStateRadio">
                            <input type="radio" name="orderState" id="ready" onChange={handleRadioChange} checked={selectedState === "ready"}/>
                            <label htmlFor="ready">Listo</label>
                        </div>
                        <div className="orderStateRadio">
                            <input type="radio" name="orderState" id="delivered" onChange={handleRadioChange} checked={selectedState === "delivered"}/>
                            <label htmlFor="delivered">Entregado</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="order">
            <div className="orderHeader">
                <div className="orderTitle">
                    <h2>Mesa 1</h2>-<p>Orden #1</p>
                </div>
                <div className="closeOrderBtnContainer">
                    <div className="closeOrderBtn"></div>
                </div>
            </div>
            <div className="orderBody">
                <div className="orderItems">
                    <div className="orderItem">
                        <p>1x Hamburguesa</p>
                        <p>$120</p>
                    </div>
                    <div className="orderItem">
                        <p>1x Papas</p>
                        <p>$50</p>
                    </div>
                    <div className="orderItem">
                        <p>1x Refresco</p>
                        <p>$30</p>
                    </div>
                    <div className="orderTotal">
                        <p>Total:</p><h2>$200</h2>
                    </div>
                </div>
                <div className="orderStateContainer">
                    <h3>Estado:</h3>
                    <div className={`orderState ${selectedState}`}>
                        <div className="orderStateRadio">
                            <input type="radio" name="orderState" id="waiting" onChange={handleRadioChange} checked={selectedState === "waiting"}/>
                            <label htmlFor="waiting">En espera</label>
                        </div>
                        <div className="orderStateRadio">
                            <input type="radio" name="orderState" id="cooking" onChange={handleRadioChange} checked={selectedState === "cooking"}/>
                            <label htmlFor="cooking">En preparación</label>
                        </div>
                        <div className="orderStateRadio">
                            <input type="radio" name="orderState" id="ready" onChange={handleRadioChange} checked={selectedState === "ready"}/>
                            <label htmlFor="ready">Listo</label>
                        </div>
                        <div className="orderStateRadio">
                            <input type="radio" name="orderState" id="delivered" onChange={handleRadioChange} checked={selectedState === "delivered"}/>
                            <label htmlFor="delivered">Entregado</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default page