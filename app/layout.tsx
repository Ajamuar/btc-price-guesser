import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="min-w-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-w-full antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
