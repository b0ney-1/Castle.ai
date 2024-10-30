"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "sonner";

export default function PuzzleSolver() {
  const router = useRouter();
  const [game, setGame] = useState(null);
  const gameRef = useRef(null);
  const messagesEndRef = useRef(null);
  const moveAudioRef = useRef(null);
  const [puzzleData, setPuzzleData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [userColor, setUserColor] = useState("white");
  const [isAIThinking, setIsAIThinking] = useState(false);
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");
  const data = encodedData ? JSON.parse(decodeURIComponent(encodedData)) : null;

  // Scrolls to the latest message in the chat
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Initializes the audio for move sounds
  useEffect(() => {
    try {
      const audio = new Audio("/move-self.wav");
      moveAudioRef.current = audio;
      audio.load();
      return () => {
        audio.removeEventListener("canplaythrough", () => {});
        audio.removeEventListener("error", () => {});
      };
    } catch (err) {
      console.error("Error initializing audio:", err);
    }
  }, []);

  // Plays the move sound
  const playMoveSound = () => {
    try {
      if (moveAudioRef.current) {
        moveAudioRef.current.currentTime = 0;
        moveAudioRef.current.play();
      }
    } catch (err) {
      console.error("Error in playMoveSound:", err);
    }
  };

  // Updates game state and synchronizes with gameRef
  const updateGame = useCallback((newGame) => {
    setGame(newGame);
    gameRef.current = newGame;
  }, []);

  // Initial setup: loads user data and puzzle data
  useEffect(() => {
    setMounted(true);
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
      fetchUserData(id);
    }
  }, []);

  // Sets up the puzzle when data and component are ready
  useEffect(() => {
    if (data && mounted && !game) {
      const newGame = new Chess(data.fen);
      const isWhiteToMove = data.fen.split(" ")[1] === "w";
      setPuzzleData(data);
      setUserColor(isWhiteToMove ? "white" : "black");
      updateGame(newGame);
    }
  }, [data, mounted, updateGame, game]);

  // Displays a welcome message for the user
  useEffect(() => {
    if (username && userColor && game && !messages.length) {
      setMessages([
        {
          role: "assistant",
          content: `Welcome ${username}! You'll be playing as ${userColor} in this puzzle.`,
          isThinking: false,
        },
      ]);
    }
  }, [username, userColor, game, messages.length]);

  // Resets game and chat state on component unmount
  useEffect(() => {
    return () => {
      setGame(null);
      gameRef.current = null;
      setMessages([]);
      setIsAIThinking(false);
      setShowSuccessDialog(false);
    };
  }, []);

  // Adds a message to the chat
  const addMessage = useCallback(
    (content, role = "assistant", isThinking = false) => {
      setMessages((prev) => [...prev, { role, content, isThinking }]);
    },
    []
  );

  // Removes any "thinking" messages from the chat
  const removeThinkingMessages = () => {
    setMessages((prev) => prev.filter((msg) => !msg.isThinking));
  };

  // Fetches AI's response to user's move
  const getMoveResponse = async (move) => {
    try {
      const prompt = `You are a chess coach. The player just made the move ${move}. 
        Give a very brief (maximum 10 words) encouraging response about their move.`;
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Failed to get move response");
      const data = await res.json();
      return data.response.trim();
    } catch (error) {
      console.error("Error getting move response:", error);
      return "Nice move! Let me think about my response...";
    }
  };

  // Provides a hint for the puzzle
  const getHint = useCallback(async () => {
    if (!gameRef.current) return;
    try {
      const prompt = `You are a chess coach. Given the current position in FEN notation: ${gameRef.current.fen()},
      provide a subtle hint about the best move without directly revealing it.`;
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Failed to get hint");
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response.trim(),
          isThinking: false,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Look for the strongest piece and its best possible move.",
          isThinking: false,
        },
      ]);
    }
  }, [gameRef]);

  // Makes a move on behalf of the user or AI
  const makeAMove = useCallback(
    async (move) => {
      if (!gameRef.current) return null;
      const gameCopy = new Chess(gameRef.current.fen());
      let result = null;
      try {
        result = gameCopy.move(move);
      } catch (error) {
        console.error("Move error:", error);
        return null;
      }
      if (result) {
        updateGame(gameCopy);
        if (gameCopy.isCheckmate()) {
          const winner = gameCopy.turn() === "w" ? "Black" : "White";
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Checkmate! ${winner} wins!`,
              isThinking: false,
            },
          ]);
          setShowSuccessDialog(true);
        } else if (gameCopy.isDraw()) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "The game is a draw!",
              isThinking: false,
            },
          ]);
        } else if (gameCopy.isCheck()) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Check!",
              isThinking: false,
            },
          ]);
        }
      }
      playMoveSound();
      return result;
    },
    [updateGame]
  );

  // Fetches the AI's next move
  const getAIMove = useCallback(async () => {
    if (!gameRef.current) return;
    const aiColor = userColor === "white" ? "b" : "w";
    if (gameRef.current.turn() !== aiColor) return;
    try {
      setIsAIThinking(true);
      await addMessage("Thinking about my move...", "assistant", true);
      const possibleMoves = gameRef.current.moves();
      const prompt = `You are a chess engine. Given the current position in FEN: ${gameRef.current.fen()},
        calculate the best move from these legal moves: ${possibleMoves.join(", ")}.`;
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ prompt }),
      });
      removeThinkingMessages();
      if (!response.ok) throw new Error("Failed to get AI move");
      const data = await response.json();
      const aiMove = data.response.trim();
      if (possibleMoves.includes(aiMove)) {
        await addMessage(`I'll play ${aiMove}`);
        await makeAMove(aiMove);
      } else {
        const bestMove = possibleMoves[0];
        await addMessage(`I'll play ${bestMove}`);
        await makeAMove(bestMove);
      }
    } catch (error) {
      const bestMove = gameRef.current.moves()[0];
      await addMessage(`I'll play ${bestMove}`);
      await makeAMove(bestMove);
    } finally {
      setIsAIThinking(false);
    }
  }, [gameRef, userColor, makeAMove]);

  // Handles user's move on the chessboard
  const onDrop = useCallback(
    async (sourceSquare, targetSquare) => {
      if (!gameRef.current || isAIThinking) return false;
      if (gameRef.current.turn() !== userColor[0]) {
        toast("Not your turn");
        return false;
      }
      const move = {
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      };
      const moveResult = await makeAMove(move);
      if (moveResult === null) {
        toast("Invalid move");
        return false;
      }
      const response = await getMoveResponse(moveResult.san);
      await addMessage(response);
      if (!gameRef.current.isGameOver()) {
        setTimeout(getAIMove, 500);
      }
      return true;
    },
    [gameRef, userColor, isAIThinking, makeAMove, getAIMove]
  );

  // Resets the puzzle to its initial state
  const resetPuzzle = useCallback(() => {
    if (puzzleData) {
      const newGame = new Chess(puzzleData.fen);
      updateGame(newGame);
      setIsAIThinking(false);
      setShowSuccessDialog(false);
      setMessages([
        {
          role: "assistant",
          content: `Welcome ${username}! You'll be playing as ${userColor} in this puzzle.`,
          isThinking: false,
        },
      ]);
    }
  }, [puzzleData, updateGame, username, userColor]);

  // Fetches user data by ID
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
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast("Error loading user data");
    }
  };

  // Signs out the user and redirects to the login page
  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen  bg-white dark:bg-black flex flex-col overflow-hidden"
    >
      {/* Navigation */}
      <nav className="h-16 px-6 flex justify-between items-center">
        <div className="text-2xl font-bold  text-black dark:text-white">
          Castle.ai
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-9 w-9 p-0"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5  text-black dark:text-white" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-lg font-semibold  text-black dark:text-white"
              >
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
            <h1 className="text-2xl font-bold mb-6  text-black dark:text-white">
              Puzzle #{puzzleData?.gameId}
            </h1>
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
                id="PuzzleBoard"
                boardWidth={600}
                position={game.fen()}
                boardOrientation={userColor}
                onPieceDrop={onDrop}
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={resetPuzzle}>Reset Position</Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/puzzle")}
              >
                Back to Puzzles
              </Button>
            </div>
          </div>

          {/* Right Column - Chat & Hint */}
          <div className="w-[400px] h-[700px] flex flex-col  bg-white dark:bg-black rounded-lg border shadow-sm">
            <div className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold  text-black dark:text-white">
                  Puzzle Tutorial
                </h2>
                {isAIThinking && (
                  <Badge
                    variant="secondary"
                    className={"text-black dark:text-white"}
                  >
                    AI is thinking...
                  </Badge>
                )}
              </div>
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
                          ? "bg-black text-white dark:bg-white dark:text-black" // User messages
                          : "bg-gray-100 text-black dark:bg-zinc-800 dark:text-white" // Assistant messages
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Hint Badge */}
            <div className="p-4 border-t flex justify-center">
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 px-6 py-2 text-base"
                onClick={getHint}
              >
                Get a hint
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Puzzle Complete!</AlertDialogTitle>
            <AlertDialogDescription>
              Congratulations! You've successfully solved this puzzle. Would you
              like to try another one?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSuccessDialog(false)}>
              Stay Here
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/puzzle")}>
              More Puzzles
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </motion.div>
  );
}
