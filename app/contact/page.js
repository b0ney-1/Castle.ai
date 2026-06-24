"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Github, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-5xl font-bold mb-8">Contact Castle.ai</h1>

        <div className="space-y-8">
          <section>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              Have questions, feedback, or want to contribute? We'd love to hear
              from you! Reach out through any of the channels below.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-start space-x-4 p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <Mail className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  For general inquiries and support:
                </p>
                <a
                  href="mailto:hello@metaschool.so"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  hello@metaschool.so
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <Github className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">GitHub</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Report bugs, request features, or contribute code:
                </p>
                <a
                  href="https://github.com/b0ney-1/Castle.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  github.com/b0ney-1/Castle.ai
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <MessageSquare className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Discord Community</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Join our community for discussions and support:
                </p>
                <a
                  href="https://discord.com/invite/vbVMUwXWgc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Join Discord Server
                </a>
              </div>
            </div>
          </section>

          <section className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Contributing</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Castle.ai is an open-source project, and we welcome contributions
              from the community. Whether you're fixing bugs, adding features, or
              improving documentation, your help makes Castle.ai better for
              everyone. Check out our GitHub repository to get started.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
