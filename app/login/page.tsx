'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push('/');  // Redirect to the home page or another protected page after successful login
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <form className="masterContainer form" onSubmit={handleSubmit}>
      <h1 className='headH1'>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="input-field">
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="email">Email</label>
      </div>
      <div className="input-field">
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}

export default Login;
