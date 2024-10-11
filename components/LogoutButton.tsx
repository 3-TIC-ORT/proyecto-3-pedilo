import { signOut, auth } from "@/auth"

export default function LogoutButton() {

  // const session = await auth();
  // if (!session.user) {
  //   return null
  // }
  return (
    <>
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button type="submit">Cerrar sesión</button>
      </form>
      <style>
        {`
          form {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;

            button {
              width: 100%;
            }
          }
        `}
      </style>
    </>
  )
}
