"use client";
import React from 'react'
import './login.css'
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/"); // Redirect to homepage or any other protected page
    }
  };

  const restaurantName = 'Ejemplo';

  return (
    <div>
      <h1>Sign In</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

//
//   return (
//     <form className="masterContainer form">
//       <h1 className='headH1'>Login</h1>
//       <div className="input-field">
//         <input type="text" name="email" placeholder="" required />
//         <label htmlFor="email">Email</label>
//       </div>
//       <div className="input-field">
//         <input type="password" name="password" placeholder="" required />
//         <label htmlFor="password">Password</label>
//       </div>
//       <button type="submit">Iniciar Sesión</button>
//     </form>
//   )
// }
//
