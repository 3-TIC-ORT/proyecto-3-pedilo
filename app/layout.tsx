import type { Metadata } from "next";
import "./globals.css";
import LogoutButton from "@/components/LogoutButton";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { getTables } from "@/actions/tables"
import {auth} from "@/auth"

const sesion = auth();
let mesa = getTables(sesion.userId);

export const metadata: Metadata = {
  title: "Pedilo",
  description: "Descripcion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const restaurantName = 'Ejemplo';
  return (
    <html lang="en">
      <body>
        <div className="header">{restaurantName} </div><LogoutButton /><div className="tableNumber"> {mesa} </div>
        {children}
        <div className="footer">
          <div className="help">Necesitas ayuda?</div>
          <div className="mozo">Llamar a un mozo</div>
        </div>
      </body>
    </html>
  );
}
