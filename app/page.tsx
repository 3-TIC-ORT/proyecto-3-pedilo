import { auth } from '@/auth';
import Link from 'next/link';
import styles from './page.module.css';

export default async function App() {
  const session = await auth();
  
  return (
    <main className={styles.main}>
      <div className={styles.text}>
        <h1><a href="/">Pedilo</a></h1>
        <h2>Bienvenido!</h2>
        <p>Te damos la bienvenida a Pedilo</p>
      </div>
      <div className={styles.buttons}>
        {!session && (
          <>
            <Link className={styles.aLinkBtn} href="/login">Iniciar sesion</Link>
            <p>o</p>
          </>
        )}
        <Link className={styles.aLinkBtn} href="/menu">Ver el menu</Link>
      </div>
    </main>
  );
}