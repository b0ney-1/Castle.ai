"use client";
import Link from "next/link";
import React from "react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Castle.ai
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              href="/about"
              className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
