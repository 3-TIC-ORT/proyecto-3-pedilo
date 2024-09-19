// Pantalla de seleccion de mesa, en caso de ingresar con enlace y no con QR
"use client";
import React, { useEffect, useRef, useState } from 'react'
import './tables.css'

// Esta funcion es para cargar cada mesa, si esta ocupada, le pone la class occupied
// Define the type for Card props
interface CardProps {
  number: number;
  isOccupied?: boolean; // Optional boolean prop
}

// Esta funcion es para cargar cada mesa, si esta ocupada, le pone la class occupied
function Card({ number, isOccupied = false }: CardProps) {
  return (
    <div className={`card ${isOccupied ? 'occupied' : ''}`}>
      Mesa {number}
    </div>
  );
}
const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // Todas las mesas que van a estar guardadas en la DB
const occupiedTables = [3, 5, 11, 13]; // Las mesas que estan ocupadas, tambien guardadas en la DB
const availableTables = tables.filter(number => !occupiedTables.includes(number)); // Filtra las mesas disponibles

function Tables() {

  //Para el btn de scroll
  const cardsRef = useRef<HTMLDivElement>(null);
  const [isRotated, setIsRotated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (cardsRef.current) {
        const scrollTop = cardsRef.current.scrollTop;
        const maxScrollTop = cardsRef.current.scrollHeight - cardsRef.current.clientHeight;
        const scrollPercentage = (scrollTop / maxScrollTop) * 100;

        setIsRotated(scrollPercentage > 75);
      }
    };
    if (cardsRef.current) {
      cardsRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (cardsRef.current) {
        cardsRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  const handleButtonClick = () => {
    if (cardsRef.current) {
      if (isRotated) {
        cardsRef.current.scrollBy({
          top: -999,
          behavior: 'smooth',
        });
      } else {
        cardsRef.current.scrollBy({
          top: 150,
          behavior: 'smooth',
        });
      }
    }
  };
  //aca termina lo del btn scroll

  return (
    <div className='masterContainer container'>
      <h1 className='headH1'>Por favor selecciona una mesa</h1>
      <div className="tables">
        <div className="cards" ref={cardsRef}>
          {availableTables.map((number) => (
            <Card key={number} number={number} />
          ))}
          {occupiedTables.map((number) => (
            <Card key={number} number={number} isOccupied />
          ))}
        </div>
        <div className={`scroll-btn ${isRotated ? 'rotated' : ''}`} onClick={handleButtonClick}>
          <img src="/media/arrow.svg" />
        </div>
      </div>
    </div>
  )
}

export default Tables
