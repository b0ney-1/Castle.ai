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
              alt="Castle.ai Chess AI - Advanced Neural Network Chess Engine"
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

      <section className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        <article className="space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Castle.ai — AI-Powered Chess for Every Player
          </h1>
          <p className="text-lg text-center max-w-3xl mx-auto">
            Master chess with Castle.ai, an advanced Chess AI platform that combines cutting-edge neural network technology with comprehensive training tools. Whether you're a beginner learning your first opening or an experienced player refining tactical patterns, our AI chess engine delivers instant analysis and personalized improvement strategies.
          </p>
        </article>

        <article className="space-y-6">
          <h2 className="text-3xl font-bold">Play Chess Against Advanced AI</h2>
          <p className="text-lg">
            Castle.ai's neural network, trained on 10 million grandmaster games, identifies tactical patterns in under 50ms. Our adaptive Chess AI system provides opponents ranging from 800 to 3000 ELO, ensuring challenging gameplay at every skill level. Chess engines evaluate over 200 million positions per second, and Castle.ai leverages this computational power to deliver human-like strategic thinking combined with tactical precision.
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg ml-4">
            <li>Analyze any position in under 2 seconds</li>
            <li>Supports all major chess openings with 500+ variations</li>
            <li>Adaptive difficulty from 800 to 3000 ELO</li>
            <li>Game history and progress tracking across all matches</li>
          </ul>
        </article>

        <article className="space-y-6">
          <h2 className="text-3xl font-bold">Analyze Your Games with AI Precision</h2>
          <p className="text-lg">
            Players who review games with AI improve 40% faster than those who practice without analysis. Castle.ai provides comprehensive post-game breakdowns that highlight critical moments, missed opportunities, and optimal continuations backed by endgame tablebase technology.
          </p>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Move-by-Move Breakdown</h3>
            <p className="text-lg">
              Every move receives detailed evaluation including positional assessment, tactical opportunities, and opening theory context. Our AI chess engine cross-references each position against millions of master games to provide contextually relevant insights.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Personalized Improvement Tips</h3>
            <p className="text-lg">
              Castle.ai tracks your playing patterns and identifies specific weaknesses in your game. Receive targeted recommendations on opening preparation, middle-game tactics, and endgame technique based on statistical analysis of your performance across hundreds of positions.
            </p>
          </div>
        </article>

        <article className="space-y-6">
          <h2 className="text-3xl font-bold">Why Castle.ai?</h2>
          <p className="text-lg">
            Unlike traditional chess engines that simply calculate moves, Castle.ai combines the computational power of modern Chess AI with pedagogical principles proven to accelerate learning. Our platform integrates opening theory databases, tactical pattern recognition, and strategic evaluation into a seamless training experience. With support for all standard chess variants and real-time position analysis, Castle.ai serves as both a formidable opponent and an expert coach.
          </p>
          <p className="text-lg">
            Join thousands of players who have elevated their game through AI-powered chess training. From understanding complex middlegame structures to mastering critical endgame positions, Castle.ai provides the tools serious players need to reach the next level.
          </p>
        </article>

        <article className="space-y-6">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">What makes Castle.ai different from Stockfish?</h3>
              <p className="text-lg">
                While Stockfish excels at pure calculation, Castle.ai is designed specifically for learning and improvement. Our neural network architecture provides human-readable explanations for each evaluation, contextual opening recommendations, and personalized training plans. Castle.ai combines the strength of modern chess engines with educational features that help you understand why moves work, not just which moves are best.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Is Castle.ai free to use?</h3>
              <p className="text-lg">
                Yes, Castle.ai offers comprehensive free access to core features including unlimited games against our Chess AI, basic position analysis, and opening training. Advanced features like deep game analysis, personalized training programs, and access to our complete database of 10 million grandmaster games are available through premium tiers.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Can beginners use Castle.ai?</h3>
              <p className="text-lg">
                Absolutely. Castle.ai scales from complete beginner to advanced player. Our adaptive difficulty system starts at 800 ELO for players learning basic piece movement and tactics. The AI provides gentle guidance for newcomers while offering the depth experienced players need. Clear explanations of chess concepts, visual board highlights, and progressive difficulty make Castle.ai ideal for players at any stage of their chess journey.
              </p>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
