import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BTC Price Guesser",
  description: "Guess if BTC goes up or down after 1 minute. Sign in to play.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-w-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-w-full antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
