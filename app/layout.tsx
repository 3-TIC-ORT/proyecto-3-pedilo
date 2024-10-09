import type { Metadata } from "next";
import "./globals.css";
import LogoutButton from "@/components/LogoutButton";
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Pedilo",
  description: "Descripcion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <a href="/">
              <img src="/media/homeIcon.svg" alt="homeIcon" />
              <p>Inicio</p>
            </a>
            <a href="/">
              <img src="/media/promotionsIcon.svg" alt="promotionsIcon" />
              <p>Promociones</p>
            </a>
            <a href="/">
              <img src="/media/searchIcon.svg" alt="searchIcon" />
              <p>Buscar</p>
            </a>
            <a href="/">
              <img src="/media/profileIcon.svg" alt="profileIcon" />
              <p>Perfil</p>
            </a>
            <a href="/">
              <img src="/media/cartIcon.svg" alt="cartIcon" />
              <p>Carrito</p>
            </a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
