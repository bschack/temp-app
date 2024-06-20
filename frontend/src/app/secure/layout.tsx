import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App - Secure",
};

export default function SecureLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div>
      {children}
    </div>
  )
}