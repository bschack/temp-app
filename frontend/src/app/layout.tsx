import type { Metadata } from "next";
import Link from "next/link";

import { SessionProvider } from "@/context/SessionContext";
import NavBar from "@/components/nav/navBar";

import "./globals.css";
import styles from './page.module.css';

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
          <div className={styles.logo_container}>
            <Link href="/">
              <h3>Ben&apos;s Test Website</h3>
            </Link>
          </div>
          <NavBar />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
