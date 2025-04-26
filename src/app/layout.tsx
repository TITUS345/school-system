import type { Metadata } from "next";
import "./globals.css";
import ToasterProvider from "@/components/ui/ToasterProvider";

export const metadata: Metadata = {
  title: "School System",
  description: "Manage school programs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
