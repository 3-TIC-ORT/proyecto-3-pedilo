import type { Metadata } from "next";
import "./globals.css";
import CallWaiterBtn from "@/components/CallWaiterBtn";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import { auth } from "@/auth";
import { getUserTables } from "@/actions/tables"; // Importa la función
import { hasPendingCall } from "@/actions/calls";
import Link from "next/link";
import { PopupProvider } from '@/context/PopupContext';
import Popups from '@/components/Popups';

export const metadata: Metadata = {
  title: "Pedilo",
  description: "La mejor forma de pedir comida en un restaurante",
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

  if (role === "user") {
    const userTables = await getUserTables(userId);
    hasTableAssigned = userTables.length > 0;
    console.log("hasTableAssigned", userTables);

    if (hasTableAssigned) {
      pendingCall = await hasPendingCall(userTables[0].tableNumber);
    }
  }

  const popupMessages = [
    { message: 'Este es un mensaje de información', isError: false },
    { message: 'Este es un mensaje de error', isError: true },
    { message: 'Otro mensaje de información', isError: false },
  ];
  
  return (
    <html lang="en">
      <PopupProvider>
      <body>
        <Popups />
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
            <Link className="callsBtn" href={`/calls`}>
              Llamados
            </Link>
          )}
          <nav>
              <Link className="aLink" href={`/menu`}>
                <img src="/media/homeIcon.svg" alt="homeIcon" />
                <p>Menu</p>
              </Link>
            {(role === "user" || role === "waiter") && (
              <>
                <Link className="aLink" href={`/cart`}>
                  <img src="/media/cartIcon.svg" alt="cartIcon" />
                  <p>Carrito</p>
                </Link>
              </>
            )}
            {role === "admin" && (
              <>
                <Link className="aLink" href={`/dashboard`}>
                  <img src="/media/customizeIcon.svg" alt="customizeIcon" />
                  <p>Personalizar</p>
                </Link>
              </>
            )}
            {role === "waiter" && (
              <>
                <Link className="aLink" href={`/calls`}>
                  <img src="/media/callsIcon.svg" alt="callsIcon" />
                  <p>Llamados</p>
                </Link>
              </>
            )}
            {(role === "waiter" || (role === "user" && !hasTableAssigned)) && (
              <>
                <Link className="aLink" href={`/tables`}>
                  <img src="/media/tableIcon.svg" alt="callsIcon" />
                  <p>Mesas</p>
                </Link>
              </>
            )}
            {(role === "waiter" || (role === "chef")) && (
              <>
                <Link className="aLink" href={`/orders`}>
                  <img src="/media/ordersIcon.svg" alt="ordersIcon" />
                  <p>Ordenes</p>
                </Link>
              </>
            )}
            <Link className="aLink" href={`/profile`}>
              <img src="/media/profileIcon.svg" alt="profileIcon" />
              <p>Perfil</p>
            </Link>
          </nav>
        </footer>
      </body>
      </PopupProvider>
    </html>
  );
}
