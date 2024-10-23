"use client";

import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function OpeningDetails({ params }) {
  // State Management
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [openingDetails, setOpeningDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userColor, setUserColor] = useState("white");
  const [suggestedMoves, setSuggestedMoves] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [openingMoves, setOpeningMoves] = useState([]);
  const [currentOpeningMove, setCurrentOpeningMove] = useState(0);
  const [isOpeningPhase, setIsOpeningPhase] = useState(true);

  // Initialization Effects
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/");
      return;
    }
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
      fetchUserData(id);
    }
  }, []);

  useEffect(() => {
    if (mounted && params.name && params.fen) {
      const decodedName = decodeURIComponent(params.name);
      const decodedFen = decodeURIComponent(params.fen);

      setOpeningDetails({
        name: decodedName,
        fen: decodedFen,
      });

      const newGame = new Chess();
      setGame(newGame);
      const tempGame = new Chess(decodedFen);
      setUserColor(tempGame.turn() === "w" ? "white" : "black");
      fetchOpeningDetails(decodedName);
    }
  }, [params.name, params.fen, mounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // API Calls
  const fetchUserData = async (id) => {
    try {
      const response = await fetch(`/api/user?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    }
  };

  const fetchOpeningDetails = async (openingName) => {
    try {
      const response = await fetch(
        `/api/openings?name=${encodeURIComponent(openingName)}`
      );
      if (!response.ok) throw new Error("Failed to fetch opening details");

      const data = await response.json();
      if (data.openings && data.openings[0]) {
        const opening = data.openings[0];
        const moves = parseOpeningMoves(opening.moves);
        setOpeningMoves(moves);
        startOpeningLesson(opening);
      }
    } catch (error) {
      console.error("Error fetching opening details:", error);
      toast.error("Failed to load opening details");
    }
  };

  // Helper Functions
  const parseOpeningMoves = (movesString) => {
    return movesString
      .split(/\d+\.?\s+/)
      .filter(Boolean)
      .map((move) => move.trim())
      .flatMap((move) => move.split(/\s+/));
  };

  const startOpeningLesson = async (opening) => {
    await addMessage(`Welcome ${username}! Let's learn the ${opening.name}.`);
    await new Promise((resolve) => setTimeout(resolve, 800));

    await addMessage(
      `This opening is known for its strategic advantages in controlling the center.`
    );
    await new Promise((resolve) => setTimeout(resolve, 800));

    await addMessage(
      `Let's start with ${openingMoves[0]}. This is the key move that defines the opening.`
    );
    setSuggestedMoves([openingMoves[0]]);
  };

  // Game Logic
  const handleUserMove = async (moveNotation) => {
    if (isOpeningPhase) {
      if (moveNotation !== openingMoves[currentOpeningMove]) {
        game.undo();
        toast.error(
          `That's not the correct move for ${openingDetails.name}. Try ${openingMoves[currentOpeningMove]}`
        );
        return false;
      }

      setMoveHistory((prev) => [...prev, moveNotation]);

      if (currentOpeningMove + 1 >= openingMoves.length) {
        await addMessage(
          "Excellent! You've completed the opening sequence. Ready to play?"
        );
        setIsOpeningPhase(false);
        setSuggestedMoves([]);
        return true;
      }

      setCurrentOpeningMove((prev) => prev + 1);
      await addMessage(
        `Great move! Now watch for ${openingMoves[currentOpeningMove + 1]}`
      );
      setTimeout(() => makeAIMove(openingMoves[currentOpeningMove + 1]), 500);
    } else {
      setMoveHistory((prev) => [...prev, game.fen()]);
      setTimeout(makeAIResponse, 500);
    }

    return true;
  };

  const makeAIMove = (moveNotation) => {
    try {
      game.move(moveNotation);
      setGame(new Chess(game.fen()));

      if (isOpeningPhase && currentOpeningMove < openingMoves.length) {
        setSuggestedMoves([openingMoves[currentOpeningMove]]);
      }

      checkGameState();
    } catch (error) {
      console.error("Invalid AI move:", error);
      toast.error("Error making AI move");
    }
  };

  const makeAIResponse = async () => {
    try {
      if (!game.isGameOver()) {
        const response = await getAIMove(game.fen());
        if (response.move) {
          makeAIMove(response.move);
        }
      }
    } catch (error) {
      console.error("AI response error:", error);
      makeRandomMove();
    }
  };

  const getAIMove = async (fen) => {
    const prompt = `As a chess AI, analyze this position (FEN: ${fen}) and provide the next best move. Return only the move in algebraic notation.`;

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to get AI move");
      const data = await response.json();
      return { move: data.response.trim() };
    } catch (error) {
      console.error("Error getting AI move:", error);
      return null;
    }
  };

  const makeRandomMove = () => {
    const moves = game.moves();
    if (moves.length > 0) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      makeAIMove(move);
    }
  };

  const checkGameState = () => {
    if (game.isCheckmate()) {
      toast.success("Checkmate! Game Over");
      return true;
    }
    if (game.isDraw()) {
      toast.info("Game Drawn");
      return true;
    }
    return false;
  };

  // UI Helpers
  const addMessage = async (content) => {
    setMessages((prev) => [...prev, { role: "assistant", content }]);
  };

  const handleSuggestedMove = (moveNotation) => {
    const move = game.move(moveNotation, { sloppy: true });
    if (move) {
      handleUserMove(moveNotation);
    }
  };

  const handleReset = () => {
    const newGame = new Chess();
    setGame(newGame);
    setIsOpeningPhase(true);
    setCurrentOpeningMove(0);
    setMoveHistory([]);
    setMessages([]);
    if (openingDetails) {
      startOpeningLesson(openingDetails);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

  if (!mounted || !game || !openingDetails) return null;

  // JSX returned here...
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen bg-background flex flex-col overflow-hidden"
    >
      {/* Navigation Bar */}
      <nav className="h-16 px-6 flex justify-between items-center border-b">
        <div className="text-2xl font-bold">Castle.ai</div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-9 w-9 p-0"
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => router.push(`/home?id=${userId}`)}
              >
                Home
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex gap-8 items-start max-w-[1200px] w-full">
          {/* Left Column - Chessboard */}
          <div className="flex-1 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6">{openingDetails.name}</h1>
            <div className="flex space-x-2 mb-4">
              <div
                className={`px-3 py-1 rounded ${
                  game.turn() === "w"
                    ? "bg-white text-black"
                    : "bg-black text-white"
                }`}
              >
                White {userColor === "white" ? "(You)" : "(AI)"}
              </div>
              <div
                className={`px-3 py-1 rounded ${
                  game.turn() === "b"
                    ? "bg-white text-black"
                    : "bg-black text-white"
                }`}
              >
                Black {userColor === "black" ? "(You)" : "(AI)"}
              </div>
            </div>

            <div className="w-[600px] mb-6">
              <Chessboard
                id="OpeningBoard"
                boardWidth={600}
                position={game.fen()}
                boardOrientation={userColor}
                onPieceDrop={(source, target) => {
                  const move = game.move({
                    from: source,
                    to: target,
                    promotion: "q",
                  });

                  if (move === null) return false;
                  return handleUserMove(move.san);
                }}
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  const newGame = new Chess();
                  setGame(newGame);
                  setSuggestedMoves([]);
                  setMoveHistory([]);
                  setCurrentOpeningMove(0);
                  setIsOpeningPhase(true);
                  startOpeningLesson(openingDetails);
                }}
              >
                Reset Position
              </Button>
              <Link href="/learn">
                <Button variant="secondary">Back to Openings</Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Chat & Moves */}
          <div className="w-[400px] h-[700px] flex flex-col bg-background rounded-lg border shadow-sm">
            <div className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Opening Tutorial</h2>
                <Badge variant={isOpeningPhase ? "default" : "secondary"}>
                  {isOpeningPhase ? "Learning Phase" : "Practice Phase"}
                </Badge>
              </div>
              {isOpeningPhase && (
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">
                    Move {currentOpeningMove + 1} of {openingMoves.length}
                  </div>
                  <div className="h-1 mt-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{
                        width: `${
                          ((currentOpeningMove + 1) / openingMoves.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative max-w-[85%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {suggestedMoves.length > 0 && (
              <div className="p-4 border-t">
                <div className="text-sm font-medium mb-2">Suggested Moves:</div>
                <div className="flex gap-2 flex-wrap">
                  {suggestedMoves.map((move, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleSuggestedMove(move)}
                    >
                      {move}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {isOpeningPhase && (
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (inputMessage.trim() === "") return;
                    setMessages((prev) => [
                      ...prev,
                      { role: "user", content: inputMessage },
                    ]);
                    // Handle user question about opening
                    setInputMessage("");
                  }}
                  className="flex gap-3"
                >
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about the opening..."
                  />
                  <Button type="submit">Send</Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <Toaster />
    </motion.div>
  );
}
