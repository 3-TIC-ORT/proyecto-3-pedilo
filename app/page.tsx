"use client";
import Image from "next/image";

export default function App() {
  return (
    <main>
      <h1>U're now on "/". click on each route to go to it.</h1>
      <ul>
        <li><a href="/menu">/menu</a></li>
        <li><a href="/auth/signin">/auth/signin</a></li>
        <li><a href="/auth/signup">/auth/signup</a></li>
        <li><a href="/cart">/cart</a></li>
        <li><a href="/tables">/tables</a></li>
      </ul>
    </main>
  );
}
