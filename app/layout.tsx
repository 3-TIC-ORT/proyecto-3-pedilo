import type { Metadata } from "next";
import "./globals.css";
import LogoutButton from "@/components/LogoutButton";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { auth } from "@/auth";

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

  return (
    <html lang="en">
      <body>
        <header>
          <img src="/images/" alt="restaurantLogo" id="restaurantLogo"/>
        </header>
        {children}
        <footer>
          <button>Llamar Mozo</button>
          <nav>
            <a href="/menu">
              <img src="/media/homeIcon.svg" alt="homeIcon" />
              <p>Inicio</p>
            </a>
            <a href="/search">
              <img src="/media/searchIcon.svg" alt="searchIcon" />
              <p>Buscar</p>
            </a>
            {role === "user" && (
              <>
                <a href="/promotions">
                  <img src="/media/promotionsIcon.svg" alt="promotionsIcon" />
                  <p>Promociones</p>
                </a>
                <a href="/cart">
                  <img src="/media/cartIcon.svg" alt="cartIcon" />
                  <p>Carrito</p>
                </a>
              </>
            )}
            {role === "admin" && (
              <a href="/dashboard/customize">
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
            {role === "chef" && (
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
