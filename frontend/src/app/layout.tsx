import type { Metadata } from "next";
import { SessionProvider } from "@/context/SessionContext";
import NavBar from "@/components/nav/navBar";

import "./globals.css";

export const metadata: Metadata = {
  title: "App - Welcome",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body>
          <NavBar />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
