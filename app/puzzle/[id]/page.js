"use client";
import { useState, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useRouter, useParams } from "next/navigation";
import { Moon, Sun, RotateCcw, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function PuzzleSolver() {
  const router = useRouter();
  const params = useParams();
  const [game, setGame] = useState(new Chess());
  const [puzzleData, setPuzzleData] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showFailureDialog, setShowFailureDialog] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setMounted(true);
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
      fetchUserData(id);
    }
  }, []);

  useEffect(() => {
    if (params?.id) {
      fetchPuzzle(params.id);
    }
  }, [params?.id]);

  const fetchPuzzle = async (puzzleId) => {
    try {
      const response = await fetch(`/api/puzzles/${puzzleId}`);
      const data = await response.json();
      setPuzzleData(data);
      const newGame = new Chess(data.fen);
      setGame(newGame);
    } catch (error) {
      console.error("Error fetching puzzle:", error);
    }
  };

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
    }
  };

  const makeAMove = useCallback(
    (move) => {
      const gameCopy = new Chess(game.fen());
      let result = null;

      try {
        result = gameCopy.move(move);
      } catch (error) {
        console.error("Invalid move:", error);
        return null;
      }

      if (result) {
        setGame(gameCopy);
        const moveNotation = `${
          result.color === "w" ? "White" : "Black"
        } moved ${result.san}`;
        setMoveHistory((prev) => [...prev, moveNotation]);

        if (gameCopy.isCheckmate()) {
          setShowSuccessDialog(true);
        } else if (gameCopy.isCheck()) {
          showToast("Check!");
        }
      }
      return result;
    },
    [game]
  );

  const onDrop = useCallback(
    (sourceSquare, targetSquare) => {
      const move = makeAMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        showToast("Invalid move", "Please try a different move.");
        return false;
      }

      // After player moves, trigger AI response
      setTimeout(() => {
        setIsAIThinking(true);
        getAIMove();
      }, 300);

      return true;
    },
    [makeAMove]
  );

  const getAIMove = async () => {
    try {
      const possibleMoves = game.moves();

      const prompt = `You are a chess engine. Given the current position in FEN: ${game.fen()}, 
        calculate the best possible move from these legal moves: ${possibleMoves.join(
          ", "
        )}. 
        Consider all tactical and strategic elements. Return only the move in algebraic notation.`;

      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to get AI move");

      const data = await response.json();
      const aiMove = data.response.trim();

      if (possibleMoves.includes(aiMove)) {
        makeAMove(aiMove);
      } else {
        const randomMove =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        makeAMove(randomMove);
      }
    } catch (error) {
      console.error("Error getting AI move:", error);
      const randomMove =
        game.moves()[Math.floor(Math.random() * game.moves().length)];
      makeAMove(randomMove);
    } finally {
      setIsAIThinking(false);
    }
  };

  const resetPuzzle = () => {
    if (puzzleData) {
      const newGame = new Chess(puzzleData.fen);
      setGame(newGame);
      setMoveHistory([]);
    }
  };

  const showToast = (title, description) => {
    setToast({ title, description });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

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
        <div className="fixed top-20 right-4 p-4 rounded-md shadow-md bg-white text-black z-50">
          <h4 className="font-bold">{toast.title}</h4>
          {toast.description && <p>{toast.description}</p>}
        </div>
      )}

      <nav className="h-16 px-6 flex justify-between items-center bg-background border-b">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          Castle.ai
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/puzzle")}
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
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

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto flex gap-8">
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                Puzzle {puzzleData?.gameId}
              </h1>
              {isAIThinking && (
                <div className="mb-4">
                  <p className="text-sm mb-2">AI is thinking...</p>
                  <Progress value={66} className="w-[60%]" />
                </div>
              )}
            </div>
            <Chessboard
              id="PuzzleBoard"
              boardWidth={600}
              position={game.fen()}
              onPieceDrop={onDrop}
            />
            <div className="mt-6 flex gap-4">
              <Button onClick={resetPuzzle} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Puzzle
              </Button>
            </div>
          </div>

          <div className="w-[400px] bg-background rounded-lg p-6">
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-4">Puzzle Information</h2>
              {puzzleData && (
                <div className="space-y-4 mb-6">
                  <div className="text-sm">
                    <span className="font-medium">Game ID:</span>{" "}
                    {puzzleData.gameId}
                  </div>
                  <div className="text-sm break-all">
                    <span className="font-medium">Position (FEN):</span>{" "}
                    {puzzleData.fen}
                  </div>
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Move History</h3>
                <ScrollArea className="h-[400px] rounded-md border">
                  <div className="p-4">
                    {moveHistory.map((move, index) => (
                      <div
                        key={index}
                        className="py-2 border-b last:border-b-0 text-sm"
                      >
                        {move}
                      </div>
                    ))}
                    {moveHistory.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        Make your first move to start the puzzle
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Puzzle Completed!</AlertDialogTitle>
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

      <AlertDialog open={showFailureDialog} onOpenChange={setShowFailureDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Incorrect Solution</AlertDialogTitle>
            <AlertDialogDescription>
              That wasn't the best move for this position. Would you like to try
              again?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowFailureDialog(false)}>
              Continue
            </AlertDialogCancel>
            <AlertDialogAction onClick={resetPuzzle}>
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
