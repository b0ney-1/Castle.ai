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

export default function OpeningDetailsClient({ name, fen, id }) {
  console.log("1. Component Initialization - Props received:", {
    name,
    fen,
    id,
  });

  // State Management
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [openingDetails, setOpeningDetails] = useState(() => {
    console.log("2. Setting initial openingDetails state");
    if (name && fen) {
      const details = {
        name: decodeURIComponent(name),
        fen: decodeURIComponent(fen),
      };
      console.log("3. Initial openingDetails:", details);
      return details;
    }
    console.log("3. No initial openingDetails");
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
  const [moveHistory, setMoveHistory] = useState([]);
  const [openingMoves, setOpeningMoves] = useState([]);
  const [currentOpeningMove, setCurrentOpeningMove] = useState(0);
  const [isOpeningPhase, setIsOpeningPhase] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initialization Effects
  useEffect(() => {
    console.log("4. Initial mount effect running");
    setMounted(true);
    const token = localStorage.getItem("jwtToken");
    console.log("5. JWT Token exists:", !!token);
    if (!token) {
      console.log("6. No token found, redirecting to home");
      router.push("/");
      return;
    }
    const id = localStorage.getItem("userId");
    if (id) {
      console.log("7. User ID found:", id);
      setUserId(id);
      fetchUserData(id);
    }
  }, []);

  useEffect(() => {
    console.log("8. Mounted state changed:", mounted);
    console.log("9. Current openingDetails:", openingDetails);
    if (mounted && openingDetails && id) {
      // Add id check
      console.log("10. Initializing game and fetching opening details");
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
        console.log("No opening details available, stopping loading");
        setIsLoading(false);
      }
    }
  }, [mounted, openingDetails, id]); // Add id to dependencies

  const fetchUserData = async (id) => {
    console.log("11. Fetching user data for ID:", id);
    try {
      const response = await fetch(`/api/user?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("12. User data fetched successfully:", data.username);
        setUsername(data.username);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("13. Error fetching user data:", error);
      toast.error("Failed to load user data");
    }
  };

  const parseOpeningMoves = (movesString) => {
    console.log("14. Parsing opening moves string:", movesString);
    if (!movesString) {
      console.log("15. No moves string provided");
      return [];
    }

    const moves = movesString
      .split(/\d+\.?\s+/)
      .filter(Boolean)
      .map((move) => move.trim())
      .flatMap((move) => move.split(/\s+/))
      .filter((move) => move && move.length > 0);

    console.log("16. Parsed moves:", moves);
    return moves;
  };

  const addMessage = async (content) => {
    console.log("17. Adding message:", content);
    setMessages((prev) => {
      console.log("18. Previous messages:", prev);
      return [...prev, { role: "assistant", content }];
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const startOpeningLesson = async (opening) => {
    console.log("19. Starting opening lesson:", opening);
    setMessages([]);

    console.log("21. Username confirmed, starting lesson messages");
    await addMessage(`Welcome ${username}! Let's learn the ${opening.name}.`);
    await new Promise((resolve) => setTimeout(resolve, 800));

    await addMessage(
      `This opening is known for its strategic advantages in controlling the center.`
    );
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (openingMoves && openingMoves.length > 0) {
      console.log("22. Setting first move:", openingMoves[0]);
      await addMessage(
        `Let's start with ${openingMoves[0]}. This is the key move that defines the opening.`
      );
      setSuggestedMoves([openingMoves[0]]);
    } else {
      console.error("23. No opening moves available");
      toast.error("Failed to load opening moves");
    }
  };

  const fetchOpeningDetails = async (openingId) => {
    console.log("24. Fetching opening details for ID:", openingId);
    setIsLoading(true);
    console.log("Loading state set to true before fetch");

    try {
      const response = await fetch(`/api/openings/${openingId}`);
      console.log("API Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch opening details");
      }

      const data = await response.json();
      console.log("25. Opening details received:", data);

      if (data.opening) {
        const opening = data.opening;
        console.log("26. Parsing moves for opening:", opening);
        const moves = parseOpeningMoves(opening.moves);
        setOpeningMoves(moves);

        console.log("27. Starting lesson with parsed moves");
        await startOpeningLesson(opening);
      } else {
        throw new Error("No opening data available");
      }
    } catch (error) {
      console.error("28. Error fetching opening details:", error);
      toast.error("Failed to load opening details");
      throw error;
    } finally {
      console.log("29. Setting loading state to false in finally block");
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

  // Debug logs for render
  useEffect(() => {
    console.log("30. Current state on render:", {
      mounted,
      game: !!game,
      openingDetails,
      isLoading,
      username,
      openingMoves,
      suggestedMoves,
    });
  });

  if (!mounted || !game || !openingDetails) {
    console.log("31. Rendering null due to:", {
      mounted,
      hasGame: !!game,
      hasOpeningDetails: !!openingDetails,
    });
    return null;
  }

  if (isLoading) {
    console.log("32. Rendering loading state");
    return (
      <div className="flex items-center justify-center h-screen">
        Loading opening details...
      </div>
    );
  } else {
    console.log("33. Rendering full component");

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
                    return handleUserMove(move.san);
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
