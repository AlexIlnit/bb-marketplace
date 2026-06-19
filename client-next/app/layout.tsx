import "./globals.css";
import { headers } from "next/headers";

export const metadata = {
  title: "BB доска объявлений",
  description: "Маркетплейс",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}