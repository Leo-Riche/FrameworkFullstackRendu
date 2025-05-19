import type { Metadata } from "next";
import "./globals.css";
 
export const metadata: Metadata = {
  title: "Portfolio IIM",
  description: "Découvrez les derniers projets des élèves de l'IIM en CDI",
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}