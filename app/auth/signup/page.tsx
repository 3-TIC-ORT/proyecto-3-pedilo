"use client"
import Link from 'next/link';
// import SignUpForm from '@/components/signUpForm';
import './register.css';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <main>
      <h1>Qué ganas de conocerte!</h1>
      <p>Ingresá tus datos y sé parte de nuestra familia.</p>
      {/* <SignUpForm /> */}
      {/* <div className="otherActions"> */}
      {/*   <button onClick={() => router.back()} className="backBtn">Cancelar</button> */}
      {/* </div> */}
      <p>Esta pagina ya no funciona, para registrarse y logearse anda a signin</p>
    </main>
  );
}
