import Header from "../components/layout/Header";

import Footer from "../components/layout/Footer";

export default function ChatLayout({ children }) {
  return (
    <>
    <Header />
    <div className=" flex flex-col overflow-hidden">
      {children}
    </div>
    </>
    
  );
}