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
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Castle.ai",
    "url": "https://castle-ai.vercel.app/",
    "logo": "https://castle-ai.vercel.app/logo.png",
    "description": "Castle.ai is an AI-powered chess platform that helps players improve their game through intelligent analysis and personalized coaching.",
    "sameAs": [
      "https://twitter.com/castleai",
      "https://github.com/castleai"
    ]
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Castle.ai",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Web",
    "description": "AI-powered chess analysis and coaching platform. Play against advanced AI, analyze your games, and improve your chess rating.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://castle-ai.vercel.app/"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Castle.ai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Castle.ai is an AI-powered chess platform that lets you play, analyze, and improve your chess game using advanced artificial intelligence."
        }
      },
      {
        "@type": "Question",
        "name": "How does Castle.ai use AI for chess?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Castle.ai uses machine learning models to analyze chess positions, suggest optimal moves, and provide personalized coaching based on your playing style."
        }
      }
    ]
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
