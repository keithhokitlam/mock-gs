import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteLegalFooter from "./components/site-legal-footer";
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
  title: "Grocery-Share.com",
  description: "Grocery-Share.com — sign in, food categories, subscriptions, and grocery adventures.",
  icons: {
    icon: "/logos/Grocery-Share%20Logo.png",
    shortcut: "/logos/Grocery-Share%20Logo.png",
    apple: "/logos/Grocery-Share%20Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <SiteLegalFooter />
      </body>
    </html>
  );
}
