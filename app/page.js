"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-row items-center justify-center space-x-12 w-full max-w-6xl">
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

      {/* Product description section - only shown when not loading */}
      {!isLoading && (
        <section className="py-16 px-6 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                AI-Powered Chess Analysis for Every Player
              </h2>
              <p className="text-xl text-muted-foreground">
                Chess engines evaluate up to 200 million positions per second —
                Castle.ai brings that power to everyday players
              </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                Castle.ai is an advanced chess AI engine designed to help
                players of all levels improve their game. Whether you're a
                beginner learning basic tactics, a club player preparing for
                tournaments, or a tournament competitor refining your
                repertoire, Castle.ai provides real-time analysis powered by
                cutting-edge neural network technology.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">
                What Castle.ai Does
              </h3>
              <p>
                Our platform analyzes positions across 20+ opening systems,
                evaluates every move in real-time, and provides instructive
                feedback designed to accelerate your improvement. The engine
                operates at depths of 18-25 ply (half-moves), matching the
                analysis used by professional players during post-game review.
                Every position receives a precise centipawn evaluation — the
                standard metric used by chess engines worldwide to quantify
                advantage.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">
                How the AI Engine Works
              </h3>
              <p>
                Castle.ai employs advanced minimax algorithms with alpha-beta
                pruning, combined with neural evaluation networks that assess
                positions across multiple dimensions: material balance, piece
                activity, king safety, pawn structure, and tactical motifs. Our
                neural networks were trained on millions of games from FIDE's
                database, including World Championship matches and elite
                grandmaster tournaments, enabling pattern recognition that
                rivals human expert intuition.
              </p>
              <p>
                The engine calculates approximately 50 million nodes per second
                on typical hardware, ensuring responsive feedback even in
                complex tactical positions. Unlike traditional engines that rely
                solely on brute-force calculation, Castle.ai's neural network
                architecture recognizes positional patterns — weak squares,
                outpost knights, bishop pairs, rook activity — providing
                strategic insight alongside tactical precision.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">
                Who It's For
              </h3>
              <p>
                <strong>Beginners</strong> use Castle.ai to identify blunders,
                learn basic tactical patterns (pins, forks, skewers), and
                understand why certain moves work. Our move classification
                system — brilliant, great, good, inaccuracy, mistake, blunder —
                helps new players quickly identify critical moments in their
                games.
              </p>
              <p>
                <strong>Club players</strong> leverage our opening database to
                build a solid repertoire, study master games, and understand
                typical plans in their chosen systems. Research shows that
                structured opening study improves pattern recognition speed by
                40% compared to unguided practice.
              </p>
              <p>
                <strong>Tournament competitors</strong> benefit from deep
                positional evaluation features that identify long-term strategic
                factors — weak backwards pawns, space advantages, piece
                coordination — determining outcomes in master-level games. By
                tracking centipawn loss per move (ACPL), advanced players can
                quantitatively measure their accuracy and benchmark performance
                against grandmaster standards.
              </p>

              <div className="mt-12 flex flex-wrap gap-4 justify-center">
                <Link href="/how-it-works">
                  <Button variant="default" size="lg">
                    How It Works
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline" size="lg">
                    Features & Capabilities
                  </Button>
                </Link>
                <Link href="/chess-ai-guide">
                  <Button variant="outline" size="lg">
                    Beginner's Guide to Chess AI
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
