import Header from "../components/layout/Header";

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
    </>
  );
}