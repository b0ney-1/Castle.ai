import localFont from "next/font/local"; // Import local font assets
import { Toaster } from "@/components/ui/sonner"; // Import toast notifications
import { ThemeProvider } from "@/components/theme-provider"; // Theme provider for dark/light mode
import { AnimatePresence } from "framer-motion"; // Animation for route transitions
import "./globals.css"; // Import global CSS
import { Suspense } from "react"; // Lazy loading with suspense
import Head from "next/head"; // Head component for metadata

// Import custom fonts with variable font weights
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

// Define page metadata
export const metadata = {
  title: "Castle.ai",
  description: "Your move, powered by AI",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

// Root layout component for global structure and theming
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" /> {/* Favicon for the site */}
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>
          <AnimatePresence mode="wait" initial={false}>
            {/* ThemeProvider enables theme switching */}
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Suspense>{children}</Suspense> {/* Lazy-load content */}
            </ThemeProvider>
          </AnimatePresence>
          {/* Footer with branding */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 text-center p-2 text-black dark:text-white">
            Powered by 🔮Metaschool
          </div>
        </main>
        <Toaster /> {/* Toast notifications */}
      </body>
    </html>
  );
}
