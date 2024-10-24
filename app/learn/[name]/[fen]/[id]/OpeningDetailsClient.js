"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

export default function OpeningDetailsClient({ name, fen, id }) {
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [openingDetails, setOpeningDetails] = useState(() => {
    if (name && fen) {
      const details = {
        name: decodeURIComponent(name),
        fen: decodeURIComponent(fen),
      };
      return details;
    }
    return null;
  });

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userColor, setUserColor] = useState("white");
  const [suggestedMoves, setSuggestedMoves] = useState([]);
  const [openingMoves, setOpeningMoves] = useState([]);
  const [currentOpeningMove, setCurrentOpeningMove] = useState(0);
  const [isOpeningPhase, setIsOpeningPhase] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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
    if (mounted && openingDetails && id) {
      const newGame = new Chess();
      setGame(newGame);
      const tempGame = new Chess(openingDetails.fen);
      setUserColor(tempGame.turn() === "w" ? "white" : "black");
      fetchOpeningDetails(id).catch((error) => {
        console.error("Error in fetchOpeningDetails:", error);
        setIsLoading(false);
      });
    } else {
      if (mounted && !openingDetails) {
        setIsLoading(false);
      }
    }
  }, [mounted, openingDetails, id]);

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
      console.log("Error in fetchUserData:", error);
    }
  };

  const parseOpeningMoves = (movesString) => {
    if (!movesString) {
      return [];
    }
    const moves = movesString
      .split(/\d+\.\s*/)
      .filter(Boolean)
      .map((move) => move.trim())
      .flatMap((move) => move.split(/\s+/))
      .filter((move) => move && move.length > 0);

    return moves;
  };

  const addMessage = async (content) => {
    setMessages((prev) => {
      return [...prev, { role: "assistant", content }];
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const startOpeningLesson = async (opening, moves) => {
    setMessages([]);
    await addMessage(`Welcome ${username}! Let's learn the ${opening.name}.`);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // AI based message
    await addMessage(
      `This opening is known for its strategic advantages in controlling the center.`
    );
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (moves && moves.length > 0) {
      console.log("startOpening Moves", moves);
      setOpeningMoves(moves);
      let openingMoveIndex = 0;
      while (openingMoveIndex < moves.length) {
        // AI based
        await addMessage(
          `Let's start with ${moves[openingMoveIndex]}. This is the key move that defines the opening.`
        );
        setSuggestedMoves([moves[openingMoveIndex]]);
        openingMoveIndex++;
      }
      startGeneralPhase();
    } else {
      // Add toast here
      console.log(
        "Failed to load opening moves. The opening moves array is empty."
      );
    }
  };

  const startGeneralPhase = async () => {
    setIsOpeningPhase(false);
    setSuggestedMoves([]);
    console.log("Start General Phase");
  };

  useEffect(() => {
    console.log("Update Opening moves:", openingMoves);
  }, [openingMoves]);

  const fetchOpeningDetails = async (openingId) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/openings/${openingId}`);
      console.log("API Response status:", response);

      if (!response.ok) {
        throw new Error("Failed to fetch opening details");
      }

      const data = await response.json();
      console.log("API Response data:", data);

      if (data && data.opening) {
        const opening = data.opening;
        const moves = parseOpeningMoves(opening.moves);
        console.log("123Opening moves:", moves);
        setOpeningMoves(moves);
        await startOpeningLesson(opening, moves);
      } else {
        throw new Error("No opening data available");
      }
    } catch (error) {
      console.log("Error in fetchOpeningDetails:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

  const handleReset = () => {
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

  // GAME Play stuff

  const showToast = (title, description, variant = "default") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const makeAMove = useCallback(
    async (move) => {
      const gameCopy = new Chess(game.fen());
      let result = null;
      try {
        result = gameCopy.move(move);
      } catch (error) {
        console.log("Result:", result);
      }

      if (result) {
        setGame(gameCopy);
        const moveNotation = `${
          result.color === "w" ? "White" : "Black"
        } moved from ${result.from} to ${result.to}`;

        setMoveHistory((prevMoveHistory) => {
          if (moveIndex < prevMoveHistory.length) {
            return [...prevMoveHistory.slice(0, moveIndex), moveNotation];
          }
          return [...prevMoveHistory, moveNotation];
        });

        setMoveIndex((prevIndex) => prevIndex + 1);

        await saveGameState();

        if (gameCopy.isCheckmate()) {
          setShowCheckmateDialog(true);
        } else if (gameCopy.isCheck()) {
          console.log("Check!");
        }
      }
      return result;
    },
    [game]
  );

  const onDrop = useCallback(
    async (sourceSquare, targetSquare) => {
      if (!gameStarted) {
        showToast(
          "Game not started",
          "Please click the Start button to begin the game.",
          "destructive"
        );
        return false;
      }
      if (game.turn() !== userColor[0]) {
        showToast(
          "Not your turn",
          "Please wait for your opponent's move.",
          "destructive"
        );
        return false;
      }
      const move = await makeAMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      console.log(move);
      if (move === null) {
        showToast(
          "Invalid move",
          "Please try a different move.",
          "destructive"
        );
        return false;
      }
      setTimeout(handleAIMove, 300);
      setMovesSinceQuickSave((prevMoves) => prevMoves + 1);
      return true;
    },
    [game, userColor, makeAMove]
  );

  const getAIMove = useCallback(async () => {
    console.log("getAIMove()");
    const aiColor = userColor === "white" ? "b" : "w";
    if (game.turn() !== aiColor) return;

    try {
      const possibleMoves = game.moves();
      console.log("Possible moves:", possibleMoves);

      let prompt = `You are a chess AI assistant. The current game state in FEN notation is: ${game.fen()}. 
The available legal moves in this position are: ${possibleMoves.join(", ")}. `;

      if (opponent === "Castle.ai") {
        prompt += `The difficulty level is set to ${mode}. Please provide the next best move for ${
          aiColor === "w" ? "white" : "black"
        } from the list of available moves in standard algebraic notation (e.g., "e4", "Nf3"). For ${mode} difficulty, ${
          mode === "easy"
            ? "choose any legal move from the list, favoring less optimal moves"
            : mode === "medium"
            ? "choose a moderately strong move from the list"
            : "choose the strongest move from the list"
        }. Return ONLY the move in standard algebraic notation, without any additional text.`;
      } else {
        prompt += `You are playing as ${opponent}. Please provide the next best move for ${
          aiColor === "w" ? "white" : "black"
        } from the list of available moves in standard algebraic notation (e.g., "e4", "Nf3"), mimicking ${opponent}'s playing style and typical strategies. 
${
  opponent === "Magnus Carlsen"
    ? "Choose moves that demonstrate positional understanding and technical precision."
    : opponent === "Garry Kasparov"
    ? "Prefer aggressive and tactical moves that create attacking opportunities."
    : opponent === "Bobby Fischer"
    ? "Focus on clear, principled moves with a mix of tactical brilliance."
    : opponent === "Samay Raina"
    ? "Choose entertaining moves that maintain a balance between fun and competitive play."
    : ""
}
Return ONLY the move in standard algebraic notation, without any additional text.`;
      }

      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch AI move");
      }

      const data = await res.json();
      const aiMove = data.response.trim();

      if (possibleMoves.includes(aiMove)) {
        console.log("Selected AI move:", aiMove);
        makeAMove(aiMove);
      } else {
        console.error("Invalid AI move received:", aiMove);
        const fallbackMove =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        console.log("Falling back to:", fallbackMove);
        makeAMove(fallbackMove);
      }
    } catch (error) {
      console.error("Error getting AI move:", error);
      const possibleMoves = game.moves();
      const fallbackMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      console.log("Error fallback move:", fallbackMove);
      makeAMove(fallbackMove);
    }
  }, [game, makeAMove, userColor]);

  const handleAIMove = useCallback(() => {
    console.log("Handle AI move called");
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setShowCheckmateDialog(true);
      } else {
        showToast(
          "Game over",
          "The game is over. Please start a new game.",
          "destructive"
        );
      }
      return;
    }
    getAIMove();
  }, [game, getAIMove]);

  if (!mounted || !game || !openingDetails) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading opening details...
      </div>
    );
  } else {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="h-screen bg-background flex flex-col overflow-hidden"
      >
        {/* Navigation */}
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
                    return handleUserMove(move);
                  }}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={handleReset}>Reset Position</Button>
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
                            ((currentOpeningMove + 1) / openingMoves.length) *
                            100
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
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
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
                  <div className="text-sm font-medium mb-2">
                    Suggested Moves:
                  </div>
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
}
