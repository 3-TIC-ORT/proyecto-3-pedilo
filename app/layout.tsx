import type { Metadata } from "next";
import "./globals.css";

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
        <div className="header">{restaurantName}</div>
        {children}
        <div className="help-mozo">
          <div className="help">Necesitas ayuda?</div>
          <div className="mozo">Llamar a un mozo</div>
        </div>
      </body>
    </html>
  );
}
