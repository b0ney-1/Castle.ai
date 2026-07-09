"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

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
  const [view, setView] = useState("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    title: "",
    variant: "default",
  });
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("jwtToken");
  }, []);

  const handleViewChange = (newView) => {
    setView(newView);
  };

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
        setTimeout(() => {
          router.push(`/home?id=${data.userId}`);
        }, 2000);
      } else {
        throw new Error(data.message || `${type} failed`);
      }
    } catch (error) {
      setAlertInfo({
        show: true,
        title: "Error",
        message: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

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
            <h1 className="text-5xl font-bold font-sans">
              Welcome to Castle.ai
            </h1>
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
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row items-center justify-center space-x-12 w-full max-w-6xl mx-auto pt-16 pb-8 px-4">
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
            unoptimized
          />
        </motion.div>
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

      <section id="features" className="w-full max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-4">Why Castle.ai?</h2>
        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
          Castle.ai is an AI-powered chess platform that analyzes your games in real time, suggests optimal moves, and helps players of all skill levels improve faster than traditional training methods.
        </p>
        <ul className="space-y-4 text-base text-neutral-700 dark:text-neutral-300">
          <li>
            <strong>Real-time move analysis</strong> — Get instant feedback on every move you make. Castle.ai evaluates each position using advanced machine learning models, highlighting blunders, missed tactics, and brilliant moves so you can learn on the spot.
          </li>
          <li>
            <strong>Adaptive AI opponent</strong> — Play against an engine that matches your skill level. Whether you are a beginner learning the basics or an advanced player sharpening your endgame, Castle.ai adjusts its strength to give you the most productive game possible.
          </li>
          <li>
            <strong>Game review &amp; insights</strong> — Understand your mistakes with detailed post-game breakdowns. After every game, Castle.ai provides a full move-by-move analysis, identifying key turning points and suggesting better continuations to help you grow as a player.
          </li>
          <li>
            <strong>Opening preparation</strong> — Explore thousands of opening lines and build a personalized repertoire. Castle.ai tracks which openings you play and recommends study material tailored to your playing style.
          </li>
          <li>
            <strong>Puzzle training</strong> — Sharpen your tactical vision with daily puzzles curated by difficulty. Solve checkmates, forks, pins, and skewers to build pattern recognition that translates directly into better over-the-board play.
          </li>
        </ul>
      </section>

      <section id="faq" className="w-full max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <dl className="space-y-6 text-base text-neutral-700 dark:text-neutral-300">
          <div>
            <dt className="font-semibold text-lg">What is Castle.ai?</dt>
            <dd className="mt-1">Castle.ai is an AI chess platform that uses machine learning to help players analyze games, practice openings, and improve their overall chess strategy. It combines a powerful evaluation engine with personalized coaching features to give every player a competitive edge.</dd>
          </div>
          <div>
            <dt className="font-semibold text-lg">Is Castle.ai free to use?</dt>
            <dd className="mt-1">Castle.ai offers a free tier with core features and premium plans for advanced analysis tools. The free plan includes real-time move analysis, adaptive AI play, and access to the puzzle trainer. Premium plans unlock deeper game insights, unlimited game reviews, and priority access to new features.</dd>
          </div>
          <div>
            <dt className="font-semibold text-lg">How does the AI analysis work?</dt>
            <dd className="mt-1">Castle.ai evaluates each position using a combination of classical chess engines and neural network models trained on millions of grandmaster games. The result is a nuanced assessment that goes beyond simple centipawn scores, offering human-readable explanations of why a move is good or bad.</dd>
          </div>
          <div>
            <dt className="font-semibold text-lg">Can beginners use Castle.ai?</dt>
            <dd className="mt-1">Absolutely. Castle.ai is designed for players of all skill levels. Beginners benefit from the adaptive AI opponent that grows with them, simple puzzle explanations, and guided opening tutorials. More experienced players can dive into deep positional analysis and engine lines to fine-tune their game.</dd>
          </div>
          <div>
            <dt className="font-semibold text-lg">What devices does Castle.ai support?</dt>
            <dd className="mt-1">Castle.ai is a web-based platform that works on any modern browser across desktop and mobile devices. There is no software to install — simply sign up, log in, and start playing or analyzing immediately.</dd>
          </div>
        </dl>
      </section>

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
