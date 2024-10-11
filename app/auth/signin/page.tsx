"use client";
import './login.css';
import { useRouter } from 'next/navigation';
import SignInForm from '@/components/signInForm';

export default function SignInPage() {
  const router = useRouter();

  return (
    <main>
      <h1>Hola! Que alegría volver a verte!</h1>
      <p>Ingresá tu email y contraseña para que sepamos quién sos.</p>
      <SignInForm />
      <div className="otherActions">
        <a href="">Ovidaste tu contraseña?</a>
        <button onClick={() => router.back()} className="backBtn">Cancelar</button>
      </div>
    </main>
  );
}
