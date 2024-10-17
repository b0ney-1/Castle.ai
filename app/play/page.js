"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { atob } from "buffer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function Play() {
  const router = useRouter();
  const [game, setGame] = useState(new Chess());
  const [mode, setMode] = useState("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [username, setUsername] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userColor, setUserColor] = useState("white");
  const [toast, setToast] = useState(null);
  const [showResignDialog, setShowResignDialog] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUserData();

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handlePopState = () => {
      setShowResignDialog(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      showToast(
        "Authentication Error",
        "Your login has expired. Please log in again.",
        "destructive"
      );
      // setTimeout(() => router.push("/"), 3000);
      console.log("Here");
    }
  };

  const showToast = (title, description, variant = "default") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const makeAMove = useCallback(
    (move) => {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      if (result) {
        setGame(gameCopy);
        const moveNotation = `${
          result.color === "w" ? "White" : "Black"
        } moved from ${result.from} to ${result.to}`;
        setMoveHistory((prevMoveHistory) => [
          moveNotation,
          ...prevMoveHistory.slice(0, moveIndex),
        ]);
        setMoveIndex(0);
      }
      return result;
    },
    [game, moveIndex]
  );

  const onDrop = useCallback(
    (sourceSquare, targetSquare) => {
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
      const move = makeAMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (move === null) {
        showToast(
          "Invalid move",
          "Please try a different move.",
          "destructive"
        );
        return false;
      }
      setTimeout(handleAIMove, 300);
      return true;
    },
    [gameStarted, game, userColor, makeAMove]
  );

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleGameStart = () => {
    const newGame = new Chess();
    setGameStarted(true);
    setGame(newGame);
    setMoveHistory([]);
    setMoveIndex(0);
    if (userColor === "black") {
      setTimeout(handleAIMove, 300);
    }
  };

  const handleGameExit = () => {
    router.push("/home");
  };

  const handlePrevMove = () => {
    if (mode !== "easy" || moveIndex >= moveHistory.length - 1) return;
    setMoveIndex((prevIndex) => prevIndex + 1);
    setGame(new Chess(game.undo()));
  };

  const handleNextMove = () => {
    if (mode !== "easy" || moveIndex <= 0) return;
    setMoveIndex((prevIndex) => prevIndex - 1);
    setGame(new Chess(game.redo()));
  };

  const getAIMove = useCallback(async () => {
    const aiColor = userColor === "white" ? "b" : "w";
    if (game.turn() !== aiColor) return;

    try {
      const prompt = `You are a chess AI assistant. The current game state in FEN notation is: ${game.fen()}. The difficulty level is set to ${mode}. Please provide the next best move for ${
        aiColor === "w" ? "white" : "black"
      } in standard algebraic notation (e.g., "e4", "Nf3"). For ${mode} difficulty, ${
        mode === "easy"
          ? "make a random legal move"
          : mode === "medium"
          ? "make a moderately strong move"
          : "make the best move possible"
      }.`;

      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch AI move");
      }

      const data = await res.json();
      const aiMove = data.response.trim();
      const possibleMoves = game.moves();
      if (possibleMoves.includes(aiMove)) {
        makeAMove(aiMove);
      } else {
        console.error("Invalid AI move:", aiMove);
        const randomMove =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        makeAMove(randomMove);
      }
    } catch (error) {
      console.error("Error getting AI move:", error);
    }
  }, [game, makeAMove, mode, userColor]);

  const handleAIMove = useCallback(() => {
    if (!gameStarted || game.turn() === userColor[0]) return;
    getAIMove();
  }, [gameStarted, game, userColor, getAIMove]);

  useEffect(() => {
    if (gameStarted && game.turn() !== userColor[0]) {
      handleAIMove();
    }
  }, [gameStarted, game, userColor, handleAIMove]);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 dark:bg-black flex flex-col"
    >
      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${
            toast.variant === "destructive" ? "bg-red-500" : "bg-blue-500"
          } text-white z-50`}
        >
          <h4 className="font-bold">{toast.title}</h4>
          <p>{toast.description}</p>
        </div>
      )}

      <nav className="py-4 px-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          Castle.ai
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div
              className={`px-3 py-1 rounded ${
                game.turn() === "w"
                  ? "bg-white text-black"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              White {userColor === "white" ? "(You)" : "(AI)"}
            </div>
            <div
              className={`px-3 py-1 rounded ${
                game.turn() === "b"
                  ? "bg-black text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              Black {userColor === "black" ? "(You)" : "(AI)"}
            </div>
          </div>
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
              <DropdownMenuItem onSelect={() => router.push("/home")}>
                Home
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/")}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="flex space-x-6">
          <div className="w-[800px]">
            <Chessboard
              id="BasicBoard"
              boardWidth={700}
              position={game.fen()}
              onPieceDrop={onDrop}
              boardOrientation={userColor}
            />
          </div>
          <div className="w-120 space-y-6">
            <div className="mb-4 flex space-x-4">
              <RadioGroup
                defaultValue="white"
                onValueChange={setUserColor}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="white" id="white" />
                  <label htmlFor="white">Play as White</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="black" id="black" />
                  <label htmlFor="black">Play as Black</label>
                </div>
              </RadioGroup>
              <Button onClick={handleGameStart} disabled={gameStarted}>
                Start Game
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Difficulty</h3>
              <RadioGroup
                defaultValue="easy"
                onValueChange={handleModeChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <label htmlFor="easy">Easy</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <label htmlFor="medium">Medium</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <label htmlFor="hard">Hard</label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Match Controls</h3>
              <div className="space-x-2">
                <Button onClick={handleGameStart}>Reset</Button>
                <AlertDialog
                  open={showResignDialog}
                  onOpenChange={setShowResignDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Resign</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to resign?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. You will return to the
                        home page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setShowResignDialog(false)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleGameExit}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  onClick={handlePrevMove}
                  disabled={
                    mode !== "easy" || moveIndex >= moveHistory.length - 1
                  }
                >
                  Previous Move
                </Button>
                <Button
                  onClick={handleNextMove}
                  disabled={mode !== "easy" || moveIndex <= 0}
                >
                  Next Move
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Moves</h3>
              <ScrollArea className="h-64 w-full rounded-md border p-4">
                {moveHistory.map((move, index) => (
                  <div
                    key={index}
                    className={`py-1 ${
                      index === moveIndex ? "bg-blue-100 dark:bg-blue-900" : ""
                    }`}
                  >
                    {moveHistory.length - index}. {move}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Play;
