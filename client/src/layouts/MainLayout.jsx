import Header from "../components/layout/Header";

import Footer from "../components/layout/Footer";

export default function MainLayout({
  children
}) {
  return (
    <>
      <Header />

      <main
        className="
        w-full
        max-w-7xl
        mx-auto
        px-4
      "
      >
        {children}
      </main>
       <Footer />
    </>
  );
}
