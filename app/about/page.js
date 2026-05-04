"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-5xl font-bold mb-8">About Castle.ai</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Castle.ai is an AI-powered chess platform designed to help players
              of all skill levels improve their game. We combine cutting-edge
              artificial intelligence with intuitive design to create a learning
              experience that adapts to your needs.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4">What We Do</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Our platform offers:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 dark:text-gray-300">
              <li>AI-powered chess analysis and move suggestions</li>
              <li>Interactive puzzles to sharpen tactical skills</li>
              <li>Opening theory exploration with real-time explanations</li>
              <li>Personalized learning paths based on your playing style</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4">Technology</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Castle.ai is powered by advanced language models and chess engines,
              combining the strategic depth of traditional chess analysis with
              modern AI capabilities. Our platform uses OpenAI's GPT models to
              provide natural language explanations and teaching moments during
              gameplay.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4">Open Source</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Castle.ai is proudly open source. We believe in transparent
              development and community collaboration. Fork our repository,
              contribute improvements, or build your own chess AI platform using
              our codebase as a foundation.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4">Built By</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Castle.ai is created and maintained by the Metaschool community, a
              group dedicated to making advanced technology accessible through
              education and open-source projects. Our team combines expertise in
              chess, artificial intelligence, and software development to create
              tools that help players grow.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
