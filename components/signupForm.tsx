'use client';

import { signup } from '@/actions/signup';
import { useState, FormEvent } from 'react';

interface SignupErrors {
  name?: string | string[];
  surname?: string | string[];
  email?: string | string[];
  password?: string | string[];
  general?: string;
}

interface SignupFormState {
  errors: SignupErrors;
  isSubmitting: boolean;
}

export default function SignupForm() {
  const [state, setState] = useState<SignupFormState>({
    errors: {},
    isSubmitting: false
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ ...state, isSubmitting: true });

    const formData = new FormData(event.currentTarget);

    try {
      const result = await signup(undefined, formData);

      // Normalize error data to match SignupErrors
      const normalizedErrors: SignupErrors = {};
      if (result?.errors) {
        for (const [key, value] of Object.entries(result.errors)) {
          // If the error is an array, join into a single string
          if (Array.isArray(value)) {
            normalizedErrors[key as keyof SignupErrors] = value.join(', ');
          } else {
            normalizedErrors[key as keyof SignupErrors] = value;
          }
        }
      }

      // If there are validation errors, update the state
      if (Object.keys(normalizedErrors).length > 0) {
        setState({ errors: normalizedErrors, isSubmitting: false });
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
        {state.errors.name && (
          <p className="text-sm text-red-500">{state.errors.name}</p>
        )}

        <div>
          <label htmlFor="surname">Surname</label>
          <input id="surname" name="surname" placeholder="Doe" />
        </div>
        {state.errors.surname && (
          <p className="text-sm text-red-500">{state.errors.surname}</p>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" placeholder="john@example.com" />
        </div>
        {state.errors.email && (
          <p className="text-sm text-red-500">{state.errors.email}</p>
        )}

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" />
        </div>
        {state.errors.password && (
          <div className="text-sm text-red-500">
            <p>Password must:</p>
            <ul>
              {Array.isArray(state.errors.password) ? (
                state.errors.password.map((error, index) => (
                  <li key={index}>- {error}</li>
                ))
              ) : (
                <li>- {state.errors.password}</li>
              )}   </ul>
          </div>
        )}

        {state.errors.general && (
          <p className="text-sm text-red-500">{state.errors.general}</p>
        )}

        <SignupButton isSubmitting={state.isSubmitting} />
      </div>
    </form>
  );
}

interface SignupButtonProps {
  isSubmitting: boolean;
}

export function SignupButton({ isSubmitting }: SignupButtonProps) {
  return (
    <button aria-disabled={isSubmitting} type="submit" className="mt-2 w-full">
      {isSubmitting ? 'Submitting...' : 'Sign Up'}
    </button>
  );
}

