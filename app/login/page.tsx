import { redirect } from "next/navigation";
import { auth, signIn, providerMap } from "@/auth";
import { AuthError } from "next-auth";
import { cookies } from 'next/headers'

import "./login.css"

interface SignInPageProps {
  searchParams: { verifyRequest?: string; callbackUrl?: string };
}

export default async function SignInPage({ searchParams }: SignInPageProps) {

  const session = await auth();
  if (!session) {
    const isVerifyRequest = searchParams.verifyRequest === "true";
    const callbackUrl = searchParams.callbackUrl || "/";
    return (
      <main>
        {isVerifyRequest ? (
          <div className="verifyContainer">
            <h1>Verifica tu correo electrónico</h1>
            <p>
              Hemos enviado un enlace de verificación a tu correo electrónico.
              Por favor, revisa tu bandeja de entrada.
            </p>
          </div>
        ) : (
          <div className="loginContainer">      <h1>Hola! Qué alegría volver a verte!</h1>
            <p>Ingresá tu email para que sepamos quién sos.</p>

            {/* Resend Provider (Email Magic Link) */}
            <form
              action={async (formData) => {
                "use server";
                const email = formData.get("email");
                const cookieStore = cookies();

                try {
                  await signIn("resend", {
                    email,
                    callbackUrl,
                  });
                } catch (error) {
                  if (error instanceof AuthError) {
                    return redirect(`/signin-error?error=${error.type}`);
                  }
                  throw error;
                }
              }}
            >
              <label htmlFor="email">
                Email
                <input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Ingresa tu correo"
                  required
                />
              </label>
              <input type="submit" value="Enviar enlace mágico" />
            </form>

            <p>O también puedes ingresar usando:</p>

            {/* Google Provider */}
            <form
              action={async () => {
                "use server";
                try {
                  await signIn("google", { callbackUrl });
                } catch (error) {
                  if (error instanceof AuthError) {
                    return redirect(`/signin-error?error=${error.type}`);
                  }
                  throw error;
                }
              }}
            >
              <button type="submit">
                <span>Iniciar sesión con Google</span>
              </button>
            </form>

            {/* Cancel Button */}
            {/* <div className="otherActions"> */}
            {/*   <button onClick={() => redirect("/")} className="backBtn"> */}
            {/*     Cancelar */}
            {/*   </button> */}
            {/* </div> */}
          </div>
        )}
      </main>
    );
  } else {
    return redirect("/");

  }
}

