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
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
  title: "Castle.ai",
  description: "Your move, powered by AI",
  icons: {
    icon: "/favicon.ico", // Updated path
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://castle-ai.vercel.app/",
    title: "Castle.ai — AI-Powered Chess Platform | Play, Analyze & Improve",
    description: "Castle.ai uses advanced AI to help chess players of all levels improve faster. Get real-time move analysis, adaptive AI opponents, and personalized training plans.",
    siteName: "Castle.ai",
    images: [
      {
        url: "https://castle-ai.vercel.app/images/og-castle-ai.png",
        width: 1200,
        height: 630,
        alt: "Castle.ai — AI-Powered Chess Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Castle.ai — AI-Powered Chess Platform",
    description: "Play chess against adaptive AI, get move-by-move analysis, and improve with personalized training. Your move, powered by AI.",
    images: ["https://castle-ai.vercel.app/images/og-castle-ai.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sourceSans.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
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
