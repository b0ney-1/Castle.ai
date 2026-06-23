"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, useScroll } from "framer-motion";
import { Sun, Moon, ArrowLeft, Clock, Calendar, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { posts } from "../posts";

export default function BlogDetail() {
  const router = useRouter();
  const params = useParams();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const slug = params?.slug;
  const post = posts.find((p) => p.slug === slug);

  // Scroll handler for custom progress bar
  useEffect(() => {
    setMounted(true);
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-neutral-500 mb-8 max-w-md">
          The chess tactic or insight article you are looking for might have been archived or moved.
        </p>
        <Button onClick={() => router.push("/blog")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Button>
      </div>
    );
  }

  // Filter out current post to show remaining posts as related
  const relatedPosts = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-neutral-500 via-neutral-800 to-black dark:from-neutral-500 dark:via-neutral-200 dark:to-white z-50 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navbar */}
      <nav className="py-4 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-40">
        <div
          className="text-2xl font-bold text-gray-800 dark:text-white cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
          onClick={() => router.push(userId ? `/home?id=${userId}` : "/")}
        >
          <span>🔮</span>
          <span>Castle.ai Blog</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/blog"
            className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
          >
            All Articles
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

      {/* Article Content Container */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to all articles
          </Link>
        </motion.div>

        {/* Article Header */}
        <header className="mb-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 mb-6 border border-neutral-200 dark:border-neutral-800">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-black dark:text-white">
                {post.author[0]}
              </div>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden mb-12 shadow-md">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Body Content */}
        <article className="prose dark:prose-invert max-w-none mb-16">
          {post.content.map((block, index) => {
            switch (block.type) {
              case "paragraph":
                return (
                  <p
                    key={index}
                    className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 font-light mb-6"
                  >
                    {block.text}
                  </p>
                );
              case "heading":
                return (
                  <h2
                    key={index}
                    className="text-2xl md:text-3xl font-bold mt-10 mb-4 tracking-tight"
                  >
                    {block.text}
                  </h2>
                );
              case "blockquote":
                return (
                  <blockquote
                    key={index}
                    className="pl-6 my-8 border-l-4 border-black dark:border-white italic text-neutral-800 dark:text-neutral-200 text-lg py-1 bg-neutral-50 dark:bg-neutral-950 rounded-r-lg pr-4"
                  >
                    "{block.text}"
                  </blockquote>
                );
              default:
                return null;
            }
          })}
        </article>

        {/* Footer Author Bio */}
        <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 flex flex-col sm:flex-row gap-6 items-start mb-16">
          <div className="w-12 h-12 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-lg flex-shrink-0">
            {post.author[0]}
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">{post.author}</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Chess analyst, AI trainer, and contributor to Castle.ai. Exploring the intersection of neural engines, algorithmic predictions, and human gameplay.
            </p>
          </div>
        </div>

        {/* Related Articles Section */}
        <section className="pt-12 border-t border-neutral-200 dark:border-neutral-800">
          <h3 className="text-2xl font-bold mb-8">Related Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group flex flex-col bg-white dark:bg-neutral-950 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-800 transition-all p-4"
              >
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-4">
                  <Image
                    src={related.image}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <h4 className="font-bold text-lg leading-tight mb-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors line-clamp-2">
                  {related.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-auto flex items-center gap-1">
                  <span>{related.category}</span>
                  <span>•</span>
                  <span>{related.readTime}</span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
