import Header from "../components/layout/Header";

import Footer from "../components/layout/Footer";

import CookieBanner from "../components/cookies/CookieBanner";

import CookieSettingsModal  from "../components/cookies/CookieSettingsModal";

import CookieFloatingButton from "../components/cookies/CookieFloatingButton";

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
       <CookieBanner />
       <CookieSettingsModal />
       <CookieFloatingButton />
    </>
  );
}
