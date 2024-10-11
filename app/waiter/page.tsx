import React from 'react';
import './styles.css'; 

const MyComponent: React.FC = () => {
  return (
    <main className="container">
      <h1 className="title">Bienvenido a (nombre)!</h1>
      <h2 className='subtitle'>Logeate asi sabemos quien sos</h2>

      <button className="button">Click me</button>
    </main>
  );
};

export default MyComponent;