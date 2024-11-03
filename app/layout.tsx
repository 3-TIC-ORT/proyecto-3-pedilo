import type { Metadata } from "next";
import "./globals.css";
import CallWaiterBtn from "@/components/CallWaiterBtn";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { auth } from "@/auth";
import { getUserTables } from "@/actions/tables"; // Importa la función
import { hasPendingCall } from "@/actions/calls";

export const metadata: Metadata = {
  title: "Pedilo",
  description: "Descripcion",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  let hasTableAssigned = false;
  let pendingCall = false;
  if (role === "user" && userId) {
    const userTables = await getUserTables(userId);
    hasTableAssigned = userTables.length > 0;
    console.log("hasTableAssigned", userTables);
    pendingCall = await hasPendingCall(userTables[0].tableNumber);
  }

  return (
    <html lang="en">
      <body>
        <header>
          <img
            src="/images/logo.svg"
            alt="restaurantLogo"
            id="restaurantLogo"
          />
        </header>
        {children}
        <footer>
          {(role === "chef" ||
            (role === "user" && hasTableAssigned && !pendingCall)) && (
              <CallWaiterBtn />
            )}
          {role === "waiter" && (
            <a className="callsBtn" href="/calls">
              Llamados
            </a>
          )}
          <nav>
            <a href="/menu">
              <img src="/media/homeIcon.svg" alt="homeIcon" />
              <p>Inicio</p>
            </a>
            {role === "user" && (
              <>
                <a href="/cart">
                  <img src="/media/cartIcon.svg" alt="cartIcon" />
                  <p>Carrito</p>
                </a>
              </>
            )}
            {role === "admin" && (
              <a href="/dashboard">
                <img src="/media/customizeIcon.svg" alt="customizeIcon" />
                <p>Personalizar</p>
              </a>
            )}
            {role === "waiter" && (
              <a href="/calls">
                <img src="/media/callsIcon.svg" alt="callsIcon" />
                <p>Llamados</p>
              </a>
            )}
            {(role === "waiter" || (role === "user" && !hasTableAssigned)) && (
              <a href="/tables">
                <img src="/media/tableIcon.svg" alt="callsIcon" />
                <p>Mesas</p>
              </a>
            )}
            {(role === "waiter" || (role === "chef")) && (
              <a href="/orders">
                <img src="/media/ordersIcon.svg" alt="ordersIcon" />
                <p>Ordenes</p>
              </a>
            )}
            <a href="/profile">
              <img src="/media/profileIcon.svg" alt="profileIcon" />
              <p>Perfil</p>
            </a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
