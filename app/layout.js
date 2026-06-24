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
  variable: "--font-source-sans",
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
  title: "Castle.ai — AI-Powered Chess Engine for Every Player",
  description: "Master chess with Castle.ai's advanced neural network trained on 10 million grandmaster games. Play against adaptive AI from 800-3000 ELO, analyze games with AI precision, and improve 40% faster with personalized training. Support for 500+ opening variations and instant position analysis in under 2 seconds.",
  keywords: "Chess AI, AI chess engine, play chess against AI, chess analysis, chess training, neural network chess, online chess, chess tactics, chess openings, chess improvement",
  alternates: {
    canonical: "https://castle-ai.vercel.app/",
  },
  openGraph: {
    title: "Castle.ai — AI-Powered Chess Engine for Every Player",
    description: "Master chess with advanced AI trained on 10 million grandmaster games. Adaptive difficulty from 800-3000 ELO with instant game analysis.",
    url: "https://castle-ai.vercel.app/",
    siteName: "Castle.ai",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
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
