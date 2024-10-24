"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Moon, Sun, RotateCcw, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
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
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "sonner";

export default function PuzzleSolver() {
  const [game, setGame] = useState(null);
  const gameRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);

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

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Update game ref when game state changes
  const updateGame = useCallback((newGame) => {
    setGame(newGame);
    gameRef.current = newGame;
  }, []);

  // Initial setup
  useEffect(() => {
    setMounted(true);
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
      fetchUserData(id);
    }
  }, []);

  useEffect(() => {
    if (data && mounted && !game) {
      // Add !game check
      const newGame = new Chess(data.fen);
      console.log(data.fen);

      const isWhiteToMove = data.fen.split(" ")[1] === "w";

      setPuzzleData(data);
      setUserColor(isWhiteToMove ? "white" : "black");
      updateGame(newGame);
    }
  }, [data, mounted, updateGame, game]);

  // Separate effect for messages
  useEffect(() => {
    if (username && userColor && game && !messages.length) {
      // Add !messages.length check
      setMessages([
        {
          role: "assistant",
          content: `Welcome ${username}! You'll be playing as ${userColor} in this puzzle.`,
          isThinking: false,
        },
      ]);
    }
  }, [username, userColor, game, messages.length]);

  useEffect(() => {
    return () => {
      setGame(null);
      gameRef.current = null;
      setMessages([]);
      setIsAIThinking(false);
      setShowSuccessDialog(false);
    };
  }, []);

  const addMessage = useCallback(
    (content, role = "assistant", isThinking = false) => {
      setMessages((prev) => [...prev, { role, content, isThinking }]);
    },
    []
  );

  const removeThinkingMessages = () => {
    setMessages((prev) => prev.filter((msg) => !msg.isThinking));
  };

  const getMoveResponse = async (move) => {
    try {
      const prompt = `You are a chess coach. The player just made the move ${move}. 
        Give a very brief (maximum 10 words) encouraging response about their move. 
        Keep it natural and varied. Don't be repetitive.`;

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

  const getHint = useCallback(async () => {
    if (!gameRef.current) return;

    try {
      const prompt = `You are a chess coach. Given the current position in FEN notation: ${gameRef.current.fen()},
      provide a subtle hint about the best move without directly revealing it.
      Consider the tactical and strategic elements but don't give away the move.
      Keep it under 15 words and make it engaging.`;

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
      console.error("Error getting hint:", error);
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

      return result;
    },
    [updateGame]
  );

  const getAIMove = useCallback(async () => {
    if (!gameRef.current) return;

    const aiColor = userColor === "white" ? "b" : "w";
    if (gameRef.current.turn() !== aiColor) return;

    try {
      setIsAIThinking(true);
      await addMessage("Thinking about my move...", "assistant", true);

      const possibleMoves = gameRef.current.moves();
      const prompt = `You are a chess engine. Given the current position in FEN: ${gameRef.current.fen()},
        calculate the absolute best possible move from these legal moves: ${possibleMoves.join(
          ", "
        )}.
        Return only the move in algebraic notation.`;

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
      console.error("Error getting AI move:", error);
      const possibleMoves = gameRef.current.moves();
      const bestMove = possibleMoves[0];
      await addMessage(`I'll play ${bestMove}`);
      await makeAMove(bestMove);
    } finally {
      setIsAIThinking(false);
    }
  }, [gameRef, userColor, makeAMove]);

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

      // Get response for user's move
      const response = await getMoveResponse(moveResult.san);
      await addMessage(response);

      // If game isn't over, make AI move
      if (!gameRef.current.isGameOver()) {
        setTimeout(getAIMove, 500);
      }

      return true;
    },
    [gameRef, userColor, isAIThinking, makeAMove, getAIMove]
  );

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

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

  if (!mounted || !game) return null;

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
            <h1 className="text-2xl font-bold mb-6">
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
          <div className="w-[400px] h-[700px] flex flex-col bg-background rounded-lg border shadow-sm">
            <div className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Puzzle Tutorial</h2>
                {isAIThinking && (
                  <Badge variant="secondary">AI is thinking...</Badge>
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