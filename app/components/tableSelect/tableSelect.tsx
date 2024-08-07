import React from 'react'

// Esta funcion es para cargar cada mesa, si esta ocupada, le pone la class occupied
function TableCard({ number, isOccupied }) {
  return (
    <div className={`tableCard ${isOccupied ? 'occupied' : ''}`}>
      Mesa {number}
    </div>
  )
}

function TableSelect() {
  const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // Todas las mesas que van a estar guardadas en la DB
  const occupiedTables = [3, 5, 11, 13]; // Las mesas que estan ocupadas, tambien guardadas en la DB

  // Filtra las mesas disponibles
  const availableTables = tables.filter(number => !occupiedTables.includes(number));

  return (
    <div className='tableSelect'>
      <h1>Por favor selecciona una mesa</h1>
      <div className="tableCardsContent">
        <div className="blur-top"></div>
        <div className="tableCards">
            {availableTables.map((number) => (
            <TableCard key={number} number={number} />
            ))}
            {occupiedTables.map((number) => (
            <TableCard key={number} number={number} isOccupied />
            ))}
        </div>
        <div className="blur-bottom"></div>
      </div>
      <div className="help">Necesitas ayuda?</div>
    </div>
  )
}

export default TableSelect
