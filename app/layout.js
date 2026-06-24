import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AnimatePresence } from "framer-motion";
import "./globals.css";
import { Suspense } from "react";
import { Source_Sans_3 } from "next/font/google";

import Footer from "@/components/ui/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-source-sans", // Add variable for CSS custom property
  fallback: [
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Arial",
    "sans-serif",
  ],
});

export const metadata = {
  title: "Castle.ai - AI-Powered Chess Platform",
  description: "Your move, powered by AI. Master chess with intelligent AI assistance, personalized lessons, and advanced gameplay analysis.",
  icons: {
    icon: "/favicon.ico", // Updated path
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sourceSans.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Preload critical LCP image */}
        <link rel="preload" as="image" href="/main.gif" fetchPriority="high" />
      </head>
      <body className={sourceSans.className}>
        <main>
          <AnimatePresence mode="wait" initial={false}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Suspense>{children}</Suspense>
              <Footer />
            </ThemeProvider>
          </AnimatePresence>
          {/* <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 text-center p-2 text-black dark:text-white">
            Powered by 🔮Metaschool
          </div> */}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
