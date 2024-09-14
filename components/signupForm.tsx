'use client';

import { signup } from '@/actions/signup';
import { useState } from 'react';

export default function SignupForm() {
  const [state, setState] = useState({
    errors: {},
    isSubmitting: false
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, isSubmitting: true });

    const formData = new FormData(event.target);

    try {
      const result = await signup(undefined, formData); // Pass formData directly

      // If there are validation errors, update the state
      if (result?.errors) {
        setState({ errors: result.errors, isSubmitting: false });
      } else {
        // Handle success (e.g., redirect or show success message)
        setState({ errors: {}, isSubmitting: false });
        // Redirect to a page or show success message here
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error('Signup error:', error);
      setState({ errors: { general: 'An error occurred. Please try again.' }, isSubmitting: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" placeholder="John" />
        </div>
        {state.errors?.name && (
          <p className="text-sm text-red-500">{state.errors.name}</p>
        )}

        <div>
          <label htmlFor="surname">Surname</label>
          <input id="surname" name="surname" placeholder="Doe" />
        </div>
        {state.errors?.surname && (
          <p className="text-sm text-red-500">{state.errors.surname}</p>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" placeholder="john@example.com" />
        </div>
        {state.errors?.email && (
          <p className="text-sm text-red-500">{state.errors.email}</p>
        )}

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" />
        </div>
        {state.errors?.password && (
          <div className="text-sm text-red-500">
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}

        <SignupButton isSubmitting={state.isSubmitting} />
      </div>
    </form>
  );
}

export function SignupButton({ isSubmitting }) {
  return (
    <button aria-disabled={isSubmitting} type="submit" className="mt-2 w-full">
      {isSubmitting ? 'Submitting...' : 'Sign Up'}
    </button>
  );
}

