import type { Metadata } from "next";
import { Dela_Gothic_One } from "next/font/google";
import "./globals.css";

const anton = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mosr Matter Attractor",
  description: "Created by Lars Moser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={anton.className}>{children}</body>
    </html>
  );
}
