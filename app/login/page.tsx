"use client";
import './login.css';
import { useRouter, useSearchParams } from 'next/navigation';
import SignInForm from '@/components/signInForm';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVerifyRequest = searchParams.get('verifyRequest') === 'true';

  return (
    <main>
      {isVerifyRequest ? (
        <div className='verifyContainer'>
          <h1>Verifica tu correo electrónico</h1>
          <p>Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, revisa tu bandeja de entrada.</p>
        </div>
      ) : (
        <>
          <h1>Hola! Que alegría volver a verte!</h1>
          <p>Ingresá tu email y contraseña para que sepamos quién sos.</p>
          <SignInForm />
          <div className="otherActions">
            <button onClick={() => router.back()} className="backBtn">Cancelar</button>
          </div>
        </>
      )}
    </main>
  );
}