"use client";
import { auth } from '@/auth';

export default async function App() {
  const session = await auth();
  return (
    <>
      <main>
        <div className="text">
          <h1><a href="/">Pedilo</a></h1>
          <h2>Bienvenido!</h2>
          <p>Te damos la bienvenida a Pedilo</p>
        </div>
        <div className="buttons">
          {!session && (
            <>
              <a href="/login">Iniciar sesion</a>
              <p>o</p>
            </>
          )}
          <a href="/menu">Ver el menu</a>
        </div>
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

          .text {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: .5rem;
          }

          h1 {
            font-size: 4rem;
            font-weight: 900;
            padding: 1rem 0;
          }

          h2 {
            font-size: 2rem;
            font-weight: 600;
          }

          p {
            font-size: 1.5rem;
            font-weight: 400;
          }

          .buttons {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            width: 50%;
            padding: 2rem 0;

            a {
              background-color: var(--light-blue);
              color: var(--white);
              padding: 1rem 2rem;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              width: 100%;
              text-align: center;
            }
          }
        `}
      </style>
    </>
  );
}
