import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MoneyTrail — Know where your money actually goes",
  description:
    "A personal expense & budget tracker that makes logging transactions near-zero-effort.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-body bg-canvas-soft text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
