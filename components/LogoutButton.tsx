"use client"
import { signOut } from "next-auth/react";
import { isAuthenticated } from "@/Utils/Auth";

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to home page after logout
  };

  const isAuth = isAuthenticated()
  if(!isAuth)
  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
