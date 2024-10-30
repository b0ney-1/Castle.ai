"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

// Typing Animation Component for welcome text animation
const TypingAnimation = ({ text, className }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className={`font-light tracking-wide ${className}`}>
      {displayText}
    </span>
  );
};

export default function Home() {
  const [view, setView] = useState("initial"); // Tracks login/register/initial view
  const [email, setEmail] = useState(""); // User email input
  const [password, setPassword] = useState(""); // User password input
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submissions
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    title: "",
    variant: "default",
  }); // Alert info for success/failure messages
  const router = useRouter();

  // Clear any stored token when component mounts
  useEffect(() => {
    localStorage.removeItem("jwtToken");
  }, []);

  // Change between login and register views
  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Handles form submissions for login or registration
  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/auth/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        // Store token and display success alert
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("userId", data.userId);
        setAlertInfo({
          show: true,
          title: "Success",
          message: `${
            type === "login" ? "Login" : "Registration"
          } successful, Setting up your board..`,
          variant: "default",
        });
        // Redirect to home page after success alert
        setTimeout(() => {
          router.push(`/home?id=${data.userId}`);
        }, 2000);
      } else {
        throw new Error(data.message || `${type} failed`);
      }
    } catch (error) {
      // Display error message if submission fails
      setAlertInfo({
        show: true,
        title: "Error",
        message: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Renders different views: initial, login, register
  const renderContent = () => {
    switch (view) {
      case "initial":
        return (
          <motion.div
            key="initial"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-8"
          >
            <h1 className="text-5xl font-bold">Welcome to Castle.ai</h1>
            <TypingAnimation
              text="Your Move, Powered by AI"
              className="text-xl text-neutral-600 dark:text-neutral-300 font-light tracking-wider"
            />
            <div className="flex space-x-12">
              <Button
                variant="default"
                onClick={() => handleViewChange("login")}
                className="text-2xl py-6 px-9"
              >
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => handleViewChange("register")}
                className="text-2xl py-6 px-9"
              >
                Register
              </Button>
            </div>
          </motion.div>
        );
      case "login":
      case "register":
        return (
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-6 w-full"
          >
            <Button
              variant="ghost"
              className="self-start"
              onClick={() => handleViewChange("initial")}
            >
              <ArrowLeft className="w-8 h-8" />
            </Button>
            <form
              onSubmit={(e) => handleSubmit(e, view)}
              className="space-y-6 w-full"
            >
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="text-xl py-3 px-4"
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="text-xl py-3 px-4"
              />
              <Button
                type="submit"
                className="w-full text-2xl py-3"
                disabled={isLoading}
              >
                {isLoading
                  ? view === "login"
                    ? "Logging in..."
                    : "Registering..."
                  : view === "login"
                  ? "Log In"
                  : "Register"}
              </Button>
            </form>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-row items-center justify-center space-x-12 w-full max-w-6xl">
        {/* Animated image or full-screen loading state */}
        <motion.div
          className={`${
            isLoading
              ? "fixed inset-0 flex items-center justify-center"
              : "w-1/2 flex justify-center"
          }`}
          animate={{
            width: isLoading ? "100%" : "50%",
            scale: isLoading ? 1.2 : 1,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Image
            src="/main.gif"
            alt="Logo"
            width={600}
            height={600}
            className="object-contain"
            priority
          />
        </motion.div>
        
        {/* Renders login, register, or initial welcome view */}
        {!isLoading && (
          <motion.div
            className="w-1/2 h-[600px] flex items-center justify-center"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {renderContent()}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      
      {/* Alert for success or error messages */}
      <AnimatePresence>
        {alertInfo.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6"
          >
            <Alert variant={alertInfo.variant} className="w-96 p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 flex-shrink-0" />
                <AlertDescription className="text-lg">
                  {alertInfo.message}
                </AlertDescription>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
