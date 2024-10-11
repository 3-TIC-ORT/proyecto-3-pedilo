"use client";
import Image from "next/image";

export default function App() {
  return (
    <>
      <main>
        <h1><a href="https://www.pedilo.tech/">Pedilo</a></h1>
        <ul>
          <li><a href="/menu">Menu</a></li>
          <li><a href="/profile">Perfil</a></li>
        </ul>
      </main>
      <style>
        {`
          main {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
          }
          h1 {
            font-size: 2rem;
            font-weight: 900;
          }
          ul {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            list-style-type: none;
          }
        `}
      </style>
    </>
  );
}
