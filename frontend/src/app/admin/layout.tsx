import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App - Admin",
};

export default function AdminLayout({
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