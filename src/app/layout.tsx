import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import InstallPrompt from "@/components/InstallPrompt";
import { AuthProvider } from "@/lib/auth";
import { MaintenanceProvider } from "@/lib/maintenance";
import { MaintenanceGuard } from "@/components/MaintenanceGuard";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#9333ea',
}

export const metadata: Metadata = {
  title: "Zeno - Study Group Finder",
  description: "Find and join study groups with fellow students. Connect, collaborate, and succeed together.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zeno",
  },
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/favicons/favicon.ico", type: "image/x-icon" },
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
        
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://zeno-app.vercel.app" />
        <meta name="twitter:title" content="Zeno - Study Group Finder" />
        <meta name="twitter:description" content="Find and join study groups with fellow students" />
        <meta name="twitter:image" content="https://zeno-app.vercel.app/favicons/android-chrome-192x192.png" />
        <meta name="twitter:creator" content="@zenoapp" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Zeno - Study Group Finder" />
        <meta property="og:description" content="Find and join study groups with fellow students" />
        <meta property="og:site_name" content="Zeno - Study Group Finder" />
        <meta property="og:url" content="https://zeno-app.vercel.app" />
        <meta property="og:image" content="https://zeno-app.vercel.app/favicons/android-chrome-192x192.png" />

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <MaintenanceProvider>
            <MaintenanceGuard>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pb-16 md:pb-0">
                  {children}
                </main>
                <Footer />
                <MobileBottomNav />
                <InstallPrompt />
              </div>
            </MaintenanceGuard>
          </MaintenanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}