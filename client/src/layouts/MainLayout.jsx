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
        max-w-7xl
        mx-auto
        p-4
      "
      >
        {children}
      </main>
       <Footer />
    </>
  );
}