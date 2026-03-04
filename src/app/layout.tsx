import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agenticar Services",
  description:
    "Interactive demo of an agentic AI workflow for automotive estimates, scheduling, and mechanic support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
