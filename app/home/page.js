"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = searchParams.get("id");

    if (id) {
      fetch(`/api/user?_id=${id}`, {
        method: "GET",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setUsername(data.username);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [searchParams]);

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 dark:bg-black flex flex-col"
    >
      <nav className="py-4 px-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          Castle.ai
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-lg font-semibold">
                {username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-12">
            {[
              { href: "/play", src: "/play.gif", title: "Play" },
              { href: "/learn", src: "/learn.gif", title: "Learn" },
              { href: "/puzzle", src: "/puzzle.gif", title: "Puzzles" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-white dark:bg-black rounded-lg p-8 w-80 h-96 shadow-lg hover:shadow-2xl active:bg-slate-100 dark:hover:shadow-2xl dark:active:bg-slate-900 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                  <div className="flex justify-center mb-6">
                    <Image
                      src={item.src}
                      alt={item.title}
                      width={150}
                      height={150}
                      className="rounded-full"
                    />
                  </div>
                  <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
                    {item.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
