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
import { Skeleton } from "@/components/ui/skeleton";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({
    play: false,
    learn: false,
    puzzle: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set component as mounted and check for user ID
    setMounted(true);
    const id = searchParams.get("id");
    if (id) {
      fetchUserData(id); // Fetch user data if ID is present
    } else {
      const token = localStorage.getItem("jwtToken");
      // Redirect to root if no token is found
      if (!token) {
        router.push("/");
      } else {
        fetchUserData(id); // Fetch user data if token exists
      }
    }
  }, [searchParams, router]);

  // Fetch user data based on provided ID
  const fetchUserData = async (id) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = `/api/user?id=${id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }

      const data = await response.json();
      setUsername(data.username);
      setUserId(id);
      setIsLoading(false);
    } catch (error) {
      // Redirect to root if there's an error fetching user data
      localStorage.removeItem("jwtToken");
      router.push("/");
    }
  };

  // Handle image load to manage loading state per image
  const handleImageLoad = (section) => {
    setImagesLoaded((prev) => ({
      ...prev,
      [section]: true,
    }));
  };

  // Sign out by clearing token and redirecting to root
  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

  // Avoid rendering until component is mounted to prevent hydration issues
  if (!mounted) return null;

  // Card data for different sections
  const cards = [
    {
      href: `/play?id=${userId}`,
      src: "/play.gif",
      title: "Play",
      key: "play",
    },
    {
      href: `/learn?id=${userId}`,
      src: "/learn.gif",
      title: "Learn",
      key: "learn",
    },
    {
      href: `/puzzle?id=${userId}`,
      src: "/puzzle.gif",
      title: "Puzzles",
      key: "puzzle",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-black flex flex-col"
    >
      <nav className="py-4 px-6 flex justify-between items-center">
        <div
          className="text-2xl font-bold text-gray-800 dark:text-white cursor-pointer"
          onClick={() => router.push("#")}
        >
          Castle.ai
        </div>
        <div className="flex items-center space-x-4">
          {/* Toggle theme button */}
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 dark:text-white text-black" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          {/* User dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-lg font-semibold dark:text-white text-black"
              >
                {isLoading ? <Skeleton className="h-6 w-24" /> : username}
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

      {/* Render cards for each section */}
      <div className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-12">
            {cards.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-white dark:bg-black rounded-lg p-8 w-80 h-96 shadow-lg hover:shadow-2xl active:bg-slate-100 dark:hover:shadow-2xl dark:active:bg-slate-900 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                  <div className="flex justify-center mb-6 relative w-[150px] h-[150px]">
                    {!imagesLoaded[item.key] && (
                      <Skeleton className="absolute w-[150px] h-[150px] rounded-full" />
                    )}
                    <Image
                      src={item.src}
                      alt={item.title}
                      width={150}
                      height={150}
                      className={`rounded-full filter ${
                        theme === "dark" ? "" : "invert"
                      } ${!imagesLoaded[item.key] ? "invisible" : ""}`}
                      onLoad={() => handleImageLoad(item.key)}
                    />
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-9 w-24" />
                  ) : (
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
                      {item.title}
                    </h2>
                  )}
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
