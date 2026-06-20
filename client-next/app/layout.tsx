import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata = {
  title: "BB доска объявлений",
  description: "Продажа товаров, авто, недвижимости и услуг",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}