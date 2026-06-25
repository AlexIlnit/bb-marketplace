import Header from "../components/layout/Header";

import Footer from "../components/layout/Footer";

export default function ChatLayout({ children }) {
  return (
    <>
    <Header />
    <div className="h-screen flex flex-col overflow-hidden">
      {children}
    </div>
    
    </>
  );
}