import type { Metadata } from "next";
import "./globals.css";
import LogoutButton from "@/components/LogoutButton";

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
        <div className="header">{restaurantName}  </div>  <LogoutButton />
        {children}
        <div className="footer">
          <div className="help">Necesitas ayuda?</div>
          <div className="mozo">Llamar a un mozo</div>
        </div>
      </body>
    </html>
  );
}
