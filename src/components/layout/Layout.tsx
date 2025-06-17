import Header from "./Header";
import { type ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh" }}>
        {children}
      </main>
    </>
  );
};

export default Layout;
