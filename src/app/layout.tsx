import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import InstallPrompt from "@/components/InstallPrompt";
import { AuthProvider } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeno - Study Group Finder",
  description: "Find and join study groups with fellow students. Connect, collaborate, and succeed together.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  manifest: "/manifest.json",
  themeColor: "#9333ea",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zeno",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Zeno" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Zeno" />
        <meta name="description" content="Find and join study groups with fellow students" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#9333ea" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#9333ea" />
        
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#9333ea" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://zeno-app.vercel.app" />
        <meta name="twitter:title" content="Zeno - Study Group Finder" />
        <meta name="twitter:description" content="Find and join study groups with fellow students" />
        <meta name="twitter:image" content="https://zeno-app.vercel.app/icons/icon-192x192.png" />
        <meta name="twitter:creator" content="@zenoapp" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Zeno - Study Group Finder" />
        <meta property="og:description" content="Find and join study groups with fellow students" />
        <meta property="og:site_name" content="Zeno - Study Group Finder" />
        <meta property="og:url" content="https://zeno-app.vercel.app" />
        <meta property="og:image" content="https://zeno-app.vercel.app/icons/icon-192x192.png" />
        
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-2048-2732.jpg" sizes="2048x2732" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1668-2224.jpg" sizes="1668x2224" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1536-2048.jpg" sizes="1536x2048" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1125-2436.jpg" sizes="1125x2436" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-828-1792.jpg" sizes="828x1792" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-750-1334.jpg" sizes="750x1334" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <InstallPrompt />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}