"use client"
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to home page after logout
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
