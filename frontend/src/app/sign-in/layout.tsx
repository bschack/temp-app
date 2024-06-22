import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App - Sign In",
};

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <h2>Sign In</h2>
      </header>
      {children}
    </>
  );
}
