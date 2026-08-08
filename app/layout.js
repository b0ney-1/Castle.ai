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
  title: "Castle.ai - AI-Powered Chess Platform",
  description: "Your move, powered by AI. Learn chess with AI-powered analysis, interactive puzzles, and personalized training.",
  icons: {
    icon: "/favicon.ico", // Updated path
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  keywords: ["chess", "AI", "chess training", "chess puzzles", "chess analysis", "learn chess"],
  authors: [{ name: "Metaschool", url: "https://metaschool.so" }],
  creator: "Metaschool",
  publisher: "Metaschool",
  openGraph: {
    title: "Castle.ai - AI-Powered Chess Platform",
    description: "Your move, powered by AI",
    url: "https://castle-ai.vercel.app",
    siteName: "Castle.ai",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Castle.ai",
    "url": "https://castle-ai.vercel.app",
    "logo": "https://castle-ai.vercel.app/favicon.ico",
    "description": "AI-Powered Chess Platform for learning and improving chess skills",
    "sameAs": [
      "https://github.com/b0ney-1/Castle.ai",
      "https://discord.com/invite/vbVMUwXWgc",
      "https://twitter.com/0xmetaschool"
    ],
    "foundingDate": "2024",
    "founder": {
      "@type": "Organization",
      "name": "Metaschool",
      "url": "https://metaschool.so"
    },
    "knowsAbout": ["Chess", "Artificial Intelligence", "Machine Learning", "Game Analysis", "Chess Education"]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Castle.ai",
    "applicationCategory": "GameApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "operatingSystem": "Web",
    "description": "AI-powered chess platform with interactive learning, puzzles, and real-time analysis"
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sourceSans.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
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
