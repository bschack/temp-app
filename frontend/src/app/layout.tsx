import type { Metadata } from "next";
import { SessionProvider } from "@/context/SessionContext";
import NavBar from "@/components/nav/navBar";

import "./globals.css";
import { hashPassword } from "@/auth";

export const metadata: Metadata = {
  title: "App - Welcome",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const password = "Password0";

  // const stuff = async () => { 
  //   const hash = await hashPassword(password);
  //   console.log(hash);
  // };

  // stuff();

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <NavBar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
