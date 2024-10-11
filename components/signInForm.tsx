"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

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

  const handleProviderSignIn = async (provider: string) => {
    const result = await signIn(provider, {
      redirect: false,
      email,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/"); // Redirect to homepage or any other protected page
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="error">{error}</div>
      <input
          type="email"
          placeholder="Email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
      />
      <button type="button" onClick={() => handleProviderSignIn('resend')}>Iniciar sesión</button>
      <button type="button" onClick={() => handleProviderSignIn('google')}>Continuar con Google</button>
    </form>
  );
}