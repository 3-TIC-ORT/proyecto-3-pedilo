import { signOut, auth } from "@/auth"

export default function LogoutButton() {

  // const session = await auth();
  // if (!session.user) {
  //   return null
  // }
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  )
}
