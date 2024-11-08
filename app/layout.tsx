import type { Metadata } from "next";
import "./globals.css";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import { auth } from "@/auth";
import { getUserTables, getWaiterTables } from "@/actions/tables"; // Importa la función
import { hasPendingCall } from "@/actions/calls";
import Link from "next/link";
import { PopupProvider } from '@/context/PopupContext';
import Popups from '@/components/Popups';
import RealtimeNotifications from '@/components/RealtimeNotifications';
import CallWaiterContainer from '@/components/CallWaiterContainer';

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

  let tablesWaiter: number[] = [];

  if (role === "user") {
    const userTables = await getUserTables(userId);
    hasTableAssigned = userTables.length > 0;
    console.log("hasTableAssigned", userTables);

    if (hasTableAssigned) {
      pendingCall = await hasPendingCall(userTables[0].tableNumber);
    }
  }
  if (userId) {
    if (role === "waiter") {
      tablesWaiter = await getWaiterTables(userId);
    }
  }

  return (
    <html lang="en">
      <PopupProvider>
        <body>
          <RealtimeNotifications userRole={role} tablesWaiter={tablesWaiter} />
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
                <CallWaiterContainer />
              )}
            {role === "waiter" && (
              <a className="callsBtn" href={`/calls`}>
                Llamados
              </a>
            )}
            <nav>
              <a className="aLink" href={`/menu`}>
                <img src="/media/homeIcon.svg" alt="homeIcon" />
                <p>Menu</p>
              </a>
              {(role === "user" || role === "waiter") && (
                <>
                  <a className="aLink" href={`/cart`}>
                    <img src="/media/cartIcon.svg" alt="cartIcon" />
                    <p>Carrito</p>
                  </a>
                </>
              )}
              {role === "admin" && (
                <>
                  <a className="aLink" href={`/dashboard`}>
                    <img src="/media/customizeIcon.svg" alt="customizeIcon" />
                    <p>Personalizar</p>
                  </a>
                </>
              )}
              {(role === "waiter" || (role === "user" && !hasTableAssigned)) && (
                <>
                  <a className="aLink" href={`/tables`}>
                    <img src="/media/tableIcon.svg" alt="callsIcon" />
                    <p>Mesas</p>
                  </a>
                </>
              )}
              {(role === "waiter" || (role === "chef")) && (
                <>
                  <a className="aLink" href={`/orders`}>
                    <img src="/media/ordersIcon.svg" alt="ordersIcon" />
                    <p>Ordenes</p>
                  </a>
                </>
              )}
              <a className="aLink" href={`/profile`}>
                <img src="/media/profileIcon.svg" alt="profileIcon" />
                <p>Perfil</p>
              </a>
            </nav>
          </footer>
        </body>
      </PopupProvider>
    </html>
  );
}
