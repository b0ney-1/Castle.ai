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
import { toast } from "sonner";
import { Toaster } from "sonner";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function OpeningDetailsClient({ name, fen, id }) {
  const router = useRouter();
  const [game, setGame] = useState(null);
  const gameRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const moveAudioRef = useRef(null);

  // Initialize audio for move sound
  useEffect(() => {
    try {
      const audio = new Audio("/move-self.wav");
      moveAudioRef.current = audio;
      audio.load(); // Preload the audio
    } catch (err) {
      console.error("Error initializing audio:", err);
    }
  }, []);

  const playMoveSound = () => {
    // Play sound for moves
    try {
      if (moveAudioRef.current) {
        moveAudioRef.current.currentTime = 0;
        moveAudioRef.current.play();
      }
    } catch (err) {
      console.error("Error in playMoveSound:", err);
    }
  };

  // State variables for game and user information
  const [openingDetails, setOpeningDetails] = useState(() => {
    if (name && fen) {
      return {
        name: decodeURIComponent(name),
        fen: decodeURIComponent(fen),
      };
    }
    return null;
  });
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
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
  const [showPracticeDialog, setShowPracticeDialog] = useState(false);
  const [moveValidationFunction, setMoveValidationFunction] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // Auto-scroll effect for chat messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, suggestedMoves]);

  // Cleanup effect to reset game state on unmount
  useEffect(() => {
    return () => {
      setGame(null);
      gameRef.current = null;
      setMessages([]);
      setSuggestedMoves([]);
      setIsGameOver(false);
    };
  }, []);

  // Game initialization effect to fetch user data and initialize game state
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

  // Update game state with the new game instance
  const updateGame = useCallback((newGame) => {
    setGame(newGame);
    gameRef.current = newGame;
  }, []);

  // Add message to chat, with optional "thinking" status for AI
  const addMessage = async (
    content,
    role = "assistant",
    isThinking = false
  ) => {
    setMessages((prev) => [...prev, { role, content, isThinking }]);
    if (!isThinking) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  // Utility function to check game state and display relevant end message
  const checkGameEnd = useCallback((currentGame) => {
    if (currentGame.isCheckmate()) {
      const winner = currentGame.turn() === "w" ? "Black" : "White";
      addMessage(`Checkmate! ${winner} wins!`);
      setIsGameOver(true);
      return true;
    }
    if (currentGame.isDraw()) {
      addMessage("Game is a draw!");
      setIsGameOver(true);
      return true;
    }
    if (currentGame.isStalemate()) {
      addMessage("Stalemate! The game is a draw.");
      setIsGameOver(true);
      return true;
    }
    if (currentGame.isThreefoldRepetition()) {
      addMessage("Draw by threefold repetition!");
      setIsGameOver(true);
      return true;
    }
    if (currentGame.isInsufficientMaterial()) {
      addMessage("Draw by insufficient material!");
      setIsGameOver(true);
      return true;
    }
    return false;
  }, []);

  const makeAMove = useCallback(
    async (move) => {
      if (!gameRef.current) return null;

      const gameCopy = new Chess(gameRef.current.fen());
      let result = null;

      try {
        result = gameCopy.move(move); // Execute move
      } catch (error) {
        console.error("Move error:", error);
        return null;
      }

      if (result) {
        updateGame(gameCopy);
        // Check game ending conditions
        if (gameCopy.isCheckmate()) {
          const winner = gameCopy.turn() === "w" ? "Black" : "White";
          await addMessage(`Checkmate! ${winner} wins!`);
          setIsGameOver(true);
        } else if (gameCopy.isCheck()) {
          toast("Check!", {
            description: "Your king is in check.",
          });
        }
      }
      playMoveSound();
      return result;
    },
    [updateGame]
  );

  // Fetch user data from the backend
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
      console.error("Error in fetchUserData:", error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    }
  };

  const parseOpeningMoves = (movesString) => {
    // Parse opening moves from string format
    if (!movesString) return [];
    return movesString
      .split(/\d+\.\s*/)
      .filter(Boolean)
      .map((move) => move.trim())
      .flatMap((move) => move.split(/\s+/))
      .filter((move) => move && move.length > 0);
  };

  // Start a lesson for the selected opening
  const startOpeningLesson = async (opening, moves) => {
    if (!gameRef.current) {
      console.error("Game not initialized");
      return;
    }

    setMessages([]);
    setIsOpeningPhase(true);
    setCurrentOpeningMove(0);
    setIsGameOver(false);

    await addMessage(`Welcome ${username}! Let's learn the ${opening.name}.`);
    await addMessage(`You'll be playing as ${userColor} in this opening.`);

    if (moves && moves.length > 0) {
      setOpeningMoves(moves);
      let moveIndex = 0;
      const playedMoves = [];

      while (moveIndex < moves.length) {
        try {
          const currentMove = moves[moveIndex];
          setCurrentOpeningMove(moveIndex);

          const isUserTurn =
            (moveIndex % 2 === 0 && userColor === "white") ||
            (moveIndex % 2 === 1 && userColor === "black");

          if (isUserTurn) {
            setSuggestedMoves([currentMove]);
            // Wait for user to make the suggested move
            const movePromise = new Promise((resolve) => {
              setMoveValidationFunction(() => (move) => {
                if (move === currentMove) {
                  resolve(true);
                } else {
                  toast("Incorrect move", {
                    description: "Please make the suggested move to continue",
                  });
                  resolve(false);
                }
              });
            });

            const moveResult = await movePromise;
            if (!moveResult) continue;
            setSuggestedMoves([]);
          } else {
            await addMessage(`I'll make the move ${currentMove}`, "assistant", true);
            await new Promise((resolve) => setTimeout(resolve, 500));

            const tempGame = new Chess(gameRef.current.fen());
            const possibleMoves = tempGame.moves({ verbose: true });
            const moveDetails = possibleMoves.find((m) => m.san === currentMove);

            if (moveDetails) {
              const aiMoveResult = await makeAMove({
                from: moveDetails.from,
                to: moveDetails.to,
                promotion: moveDetails.promotion || "q",
              });

              if (!aiMoveResult) {
                throw new Error("Failed to make AI move");
              }
            }
          }

          playedMoves.push(currentMove);
          moveIndex++;
          setCurrentOpeningMove(moveIndex);
        } catch (error) {
          console.error("Error in opening lesson:", error);
          toast("Error", {
            description: "There was an error in the opening lesson",
          });
          break;
        }
      }

      if (moveIndex === moves.length) {
        await addMessage("Excellent! You've completed the opening sequence!");
        setShowPracticeDialog(true);
      }
    }
  };

  // Fetch opening details based on ID
  const fetchOpeningDetails = async (openingId) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/openings/${openingId}`);
      if (!response.ok) throw new Error("Failed to fetch opening details");

      const data = await response.json();
      if (data && data.opening) {
        const opening = data.opening;
        const moves = parseOpeningMoves(opening.moves);
        setOpeningMoves(moves);
        setIsLoading(false);
        await startOpeningLesson(opening, moves);
      } else {
        throw new Error("No opening data available");
      }
    } catch (error) {
      console.error("Error in fetchOpeningDetails:", error);
      toast("Error", {
        description: "Failed to load opening details",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    // Sign out user and clear token
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

  const handleReset = async () => {
    // Reset game and restart lesson
    const newGame = new Chess();
    updateGame(newGame);
    setIsOpeningPhase(true);
    setCurrentOpeningMove(0);
    setSuggestedMoves([]);
    setIsGameOver(false);
    setMessages([]);
    startOpeningLesson(openingDetails, openingMoves);
  };

  // Initial game setup effect to analyze the first move
  useEffect(() => {
    if (mounted && openingDetails && id) {
      const newGame = new Chess();
      updateGame(newGame);

      const tempGame = new Chess();
      const moves = parseOpeningMoves(openingDetails.moves);

      if (moves && moves.length > 0) {
        const firstMove = moves[0];
        try {
          tempGame.move(firstMove);
          setUserColor("white");
        } catch (error) {
          setUserColor("black");
        }
      }

      fetchOpeningDetails(id).catch((error) => {
        console.error("Error in fetchOpeningDetails:", error);
        toast("Error", {
          description: "Failed to load opening details",
        });
        setIsLoading(false);
      });
    } else {
      if (mounted && !openingDetails) {
        setIsLoading(false);
      }
    }
  }, [mounted, openingDetails, id, updateGame]);

  if (!mounted || !game || !openingDetails || isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen bg-background flex flex-col overflow-hidden bg-white dark:bg-black"
    >
      {/* Navigation Bar */}
      <nav className="h-16 px-6 flex justify-between items-center">
        <div className="text-2xl font-bold dark:text-white text-black">
          Castle.ai
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-9 w-9 p-0"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 dark:text-white text-black" />
            ) : (
              <Sun className="h-5 w-5 dark:text-white text-black" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-lg font-semibold dark:text-white text-black"
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

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        {/* Chessboard and Tutorial Panel */}
        {/* ... main chessboard and tutorial content ... */}
      </div>

      {/* Practice Dialog */}
      <AlertDialog
        open={showPracticeDialog}
        onOpenChange={setShowPracticeDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opening Complete!</AlertDialogTitle>
            <AlertDialogDescription>
              You've successfully learned the {openingDetails.name}. What would
              you like to do next?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowPracticeDialog(false);
                handleReset();
              }}
            >
              Practice Again
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                setShowPracticeDialog(false);
                startGeneralPhase();
              }}
            >
              Continue Playing
            </AlertDialogAction>
            <AlertDialogAction onClick={() => router.push("/learn")}>
              Exit to Openings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toaster */}
      <Toaster richColors position="top-right" />
    </motion.div>
  );
}
