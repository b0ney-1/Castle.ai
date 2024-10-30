"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Toggle } from "@/components/ui/toggle";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Play() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [game, setGame] = useState(new Chess());
  const [mode, setMode] = useState("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userColor, setUserColor] = useState("white");
  const [toast, setToast] = useState(null);
  const [showResignDialog, setShowResignDialog] = useState(false);
  const [showCheckmateDialog, setShowCheckmateDialog] = useState(false);
  const [opponent, setOpponent] = useState("Castle.ai");
  const [isLoadingGame, setIsLoadingGame] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [quickSave, setQuickSave] = useState(null);
  const [movesSinceQuickSave, setMovesSinceQuickSave] = useState(0);
  const moveAudioRef = useRef(null);

  // Initialize audio for move sound effect
  useEffect(() => {
    const audio = new Audio("/move-self.wav");
    moveAudioRef.current = audio;
    audio.load(); // Preload audio

    // Cleanup on unmount
    return () => {
      audio.removeEventListener("canplaythrough", () => {});
      audio.removeEventListener("error", () => {});
    };
  }, []);

  // Play sound on move
  const playMoveSound = () => {
    if (moveAudioRef.current) {
      moveAudioRef.current.currentTime = 0;
      moveAudioRef.current.play().catch((err) => console.error("Playback error:", err));
    }
  };

  // Set up user data and state on mount
  useEffect(() => {
    setMounted(true);
    const id = searchParams.get("id");
    if (id) {
      setUserId(id);
      fetchUserData(id);
    } else {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/");
      } else {
        fetchUserData(null, token);
      }
    }

    // Save game on exit
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    // Prompt to resign when navigating away
    const handlePopState = () => setShowResignDialog(true);

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [searchParams, router, gameStarted]);

  // Save current game state
  const saveGameState = async () => {
    try {
      const pgn = game.pgn();

      await fetch("/api/game-state/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({
          userId,
          gameState: {
            pgn,
            fen: game.fen(),
            userColor,
            opponent,
            mode,
            moveHistory,
            gameStarted,
          },
        }),
      });

      showToast("Game saved successfully");
    } catch (error) {
      console.error("Error saving game:", error);
      showToast("Error saving game", "destructive");
    }
  };

  // Reset game state
  const resetGameState = async () => {
    try {
      const newGame = new Chess();
      await fetch("/api/game-state/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({
          userId,
          gameState: {
            pgn: newGame.pgn(),
            fen: newGame.fen(),
            userColor,
            opponent,
            mode,
            moveHistory: [],
            gameStarted: false,
          },
        }),
      });
      showToast("Game reset");
    } catch (error) {
      console.error("Error resetting game:", error);
      showToast("Error resetting game", "destructive");
    }
  };

  // Load saved game state if available
  const loadSavedGame = async () => {
    try {
      const response = await fetch(`/api/game-state/game?id=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load saved game");

      const data = await response.json();
      if (data.savedGameState) {
        const newGame = new Chess();
        data.savedGameState.pgn ? newGame.loadPgn(data.savedGameState.pgn) : newGame.load(data.savedGameState.fen);

        setGame(newGame);
        setUserColor(data.savedGameState.userColor);
        setOpponent(data.savedGameState.opponent);
        setMode(data.savedGameState.mode);
        setMoveHistory(data.savedGameState.moveHistory);
        setGameStarted(data.savedGameState.gameStarted);
        setMoveIndex(data.savedGameState.moveHistory.length);
      }
    } catch (error) {
      console.error("Error loading saved game:", error);
      showToast("Failed to load saved game", "destructive");
    } finally {
      setIsLoadingGame(false);
    }
  };

  // Fetch user data based on user ID or token
  const fetchUserData = async (id, token) => {
    try {
      const url = id ? `/api/user?id=${id}` : "/api/user";
      const headers = token ? { Authorization: `Bearer ${token}` } : { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` };

      const response = await fetch(url, { headers });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setUserId(data._id || id);
      } else if (response.status === 401) {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      showToast("Authentication Error", "destructive");
      setTimeout(() => router.push("/"), 3000);
    }
  };

  // Show notification toast
  const showToast = (title, variant = "default") => {
    setToast({ title, variant });
    setTimeout(() => setToast(null), 3000);
  };

  // Make a move and update game state
  const makeAMove = useCallback(
    async (move) => {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);

      if (result) {
        setGame(gameCopy);
        setMoveHistory((prev) => [...prev, `${result.color === "w" ? "White" : "Black"} moved from ${result.from} to ${result.to}`]);
        setMoveIndex((prevIndex) => prevIndex + 1);
        await saveGameState();

        if (gameCopy.isCheckmate()) setShowCheckmateDialog(true);
      }
      return result;
    },
    [game]
  );

  // Handle user move by drag-drop on the chessboard
  const onDrop = useCallback(
    async (sourceSquare, targetSquare) => {
      if (!gameStarted) {
        showToast("Start the game to make a move", "destructive");
        return false;
      }
      if (game.turn() !== userColor[0]) {
        showToast("Wait for your opponent's move", "destructive");
        return false;
      }
      const move = await makeAMove({ from: sourceSquare, to: targetSquare, promotion: "q" });
      playMoveSound();
      setTimeout(handleAIMove, 300);
      return !!move;
    },
    [gameStarted, game, userColor, makeAMove]
  );

  // Handle AI move based on the selected difficulty or opponent
  const getAIMove = useCallback(async () => {
    if (game.turn() !== (userColor === "white" ? "b" : "w")) return;

    const possibleMoves = game.moves();
    const prompt = `The game state is ${game.fen()}, legal moves are: ${possibleMoves.join(", ")}. For ${mode} difficulty, suggest a move.`;

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const aiMove = data.response.trim();
      if (possibleMoves.includes(aiMove)) {
        makeAMove(aiMove);
        playMoveSound();
      }
    } catch (error) {
      console.error("Error getting AI move:", error);
      makeAMove(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
    }
  }, [game, makeAMove, mode, userColor]);

  // Execute AI move after user move
  const handleAIMove = useCallback(() => {
    if (!game.isGameOver()) getAIMove();
    else if (game.isCheckmate()) setShowCheckmateDialog(true);
  }, [game, getAIMove]);

  // Update AI move if game started and it's AI's turn
  useEffect(() => {
    if (gameStarted && game.turn() !== userColor[0]) handleAIMove();
  }, [gameStarted, game, userColor, handleAIMove]);

  if (!mounted || isLoadingGame) {
    // Display loading skeleton while game loads
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-black flex flex-col">
        <nav className="py-4 px-6 flex justify-between items-center">
          <div className="text-2xl font-bold">
            <Skeleton className="h-8 w-24" />
          </div>
        </nav>
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <Skeleton className="h-[700px] w-[700px]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="min-h-screen bg-white dark:bg-black flex flex-col">
      {toast && <div className={`fixed top-20 right-4 p-4 rounded-md shadow-md bg-white dark:bg-black border-2 ${toast.variant === "destructive" ? "border-grey-500" : "border-grey-500"} text-black dark:text-white z-50`}>{toast.title}</div>}

      <nav className="py-4 px-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">Castle.ai</div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon className="h-5 w-5 dark:text-white text-black" /> : <Sun className="h-5 w-5" />}</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-lg font-semibold dark:text-white text-black">{username}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => router.push(`/home?id=${userId}`)}>Home</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => localStorage.removeItem("jwtToken") || router.push("/")}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="flex space-x-6">
          <Chessboard id="BasicBoard" boardWidth={700} position={game.fen()} onPieceDrop={onDrop} boardOrientation={userColor} />
        </div>
      </div>

      {/* Dialogs for checkmate, resign, and exit */}
      <AlertDialog open={showCheckmateDialog} onOpenChange={setShowCheckmateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Checkmate!</AlertDialogTitle>
            <AlertDialogDescription>The game has ended in checkmate. What would you like to do?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCheckmateDialog(false)}>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setGameStarted(false); setMoveHistory([]); }}>Start New Game</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

export default Play;
