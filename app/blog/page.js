"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon, ArrowRight, BookOpen, Clock, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { posts } from "./posts";

export default function BlogIndex() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setMounted(true);
    // Retrieve userId if logged in
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
    }
  }, []);

  if (!mounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Navbar */}
      <nav className="py-4 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div
          className="text-2xl font-bold text-gray-800 dark:text-white cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
          onClick={() => router.push(userId ? `/home?id=${userId}` : "/")}
        >
          <span>🔮</span>
          <span>Castle.ai Blog</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href={userId ? `/home?id=${userId}` : "/"}
            className="text-sm font-medium hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            {userId ? "Dashboard" : "Home"}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-9 h-9"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-black" />
            ) : (
              <Sun className="h-5 w-5 text-white" />
            )}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden border-b border-gray-150 dark:border-gray-900 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-250 dark:border-gray-800 bg-white dark:bg-neutral-900 text-xs font-medium text-gray-600 dark:text-gray-400 mb-6"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Castle.ai Insights</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-black via-neutral-700 to-black dark:from-white dark:via-neutral-300 dark:to-white"
          >
            Where Artificial Intelligence <br className="hidden md:block" /> Meets Chess Strategy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Stay ahead of the game. Discover AI insights, modern opening tutorials, and the psychology behind playing chess against machines.
          </motion.p>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post) => (
            <motion.article
              key={post.slug}
              variants={itemVariants}
              className="group flex flex-col bg-white dark:bg-neutral-950 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-900 hover:border-gray-300 dark:hover:border-neutral-800 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] transform hover:-translate-y-1"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-550 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-900/80 text-white dark:bg-white/90 dark:text-black backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-3 tracking-tight group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed font-light mb-4">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-neutral-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold">
                        {post.author[0]}
                      </div>
                      <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                        {post.author}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-neutral-900 dark:text-white group-hover:translate-x-1 transition-transform">
                      Read
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
