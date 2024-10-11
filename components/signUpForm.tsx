// 'use client';
//
// // import { signup } from '@/actions/signup';
// import { useState, FormEvent } from 'react';
//
// interface SignupErrors {
//   name?: string | string[];
//   surname?: string | string[];
//   email?: string | string[];
//   password?: string | string[];
//   general?: string;
// }
//
// interface SignupFormState {
//   errors: SignupErrors;
//   isSubmitting: boolean;
// }
//
// export default function SignupForm() {
//   const [state, setState] = useState<SignupFormState>({
//     errors: {},
//     isSubmitting: false
//   });
//
//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setState({ ...state, isSubmitting: true });
//
//     const formData = new FormData(event.currentTarget);
//
//     try {
//       const result = await signup(undefined, formData);
//
//       // Normalize error data to match SignupErrors
//       const normalizedErrors: SignupErrors = {};
//       if (result?.errors) {
//         for (const [key, value] of Object.entries(result.errors)) {
//           // If the error is an array, join into a single string
//           if (Array.isArray(value)) {
//             normalizedErrors[key as keyof SignupErrors] = value.join(', ');
//           } else {
//             normalizedErrors[key as keyof SignupErrors] = value;
//           }
//         }
//       }
//
//       // If there are validation errors, update the state
//       if (Object.keys(normalizedErrors).length > 0) {
//         setState({ errors: normalizedErrors, isSubmitting: false });
//       } else {
//         // Handle success (e.g., redirect or show success message)
//         setState({ errors: {}, isSubmitting: false });
//         // Redirect to a page or show success message here
//       }
//     } catch (error) {
//       // Catch any unexpected errors
//       console.error('Signup error:', error);
//       setState({ errors: { general: 'An error occurred. Please try again.' }, isSubmitting: false });
//     }
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//           type="text"
//           placeholder="Nombre"
//           id="name"
//           name="name"
//           required
//       />
//       {state.errors.name && (
//         <p className="error">{state.errors.name}</p>
//       )}
//       <input
//           type="text"
//           placeholder="Apellido"
//           id="surname"
//           name="surname"
//           required
//       />
//       {state.errors.surname && (
//         <p className="error">{state.errors.surname}</p>
//       )}
//       <input
//           type="email"
//           placeholder="Email"
//           id="email"
//           name="email"
//           required
//       />
//       {state.errors.email && (
//         <p className="error">{state.errors.email}</p>
//       )}
//       <input
//           type="password"
//           placeholder="Contraseña"
//           id="password"
//           name="password"
//           required
//       />
//       {state.errors.password && (
//           <div className="error">
//             <p>Password must:</p>
//             <ul>
//               {Array.isArray(state.errors.password) ? (
//                 state.errors.password.map((error, index) => (
//                   <li key={index}>- {error}</li>
//                 ))
//               ) : (
//                 <li>- {state.errors.password}</li>
//               )}   </ul>
//           </div>
//         )}
//         {state.errors.general && (
//           <p className="error">{state.errors.general}</p>
//         )}
//       <SignupButton isSubmitting={state.isSubmitting} />
//     </form>
//   );
// }
//
// interface SignupButtonProps {
//   isSubmitting: boolean;
// }
//
// export function SignupButton({ isSubmitting }: SignupButtonProps) {
//   return (
//     <button aria-disabled={isSubmitting} disabled={isSubmitting} type="submit">
//       {isSubmitting ? 'Registrandote...' : 'Registrarse'}
//     </button>
//   );
// }
