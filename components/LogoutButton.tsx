"use client"
import { signOut } from "next-auth/react";
import { isAuthenticated } from "@/Utils/Auth";

export default async function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to home page after logout
  };

  // const authResult = await isAuthenticated(req);
  //
  // if (!authResult)
  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
